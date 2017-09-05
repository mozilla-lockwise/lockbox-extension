/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import { mount } from "enzyme";
import React from "react";
import ReactDOM from "react-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import { initialState, filledState } from "../mock-redux-state";
import MockLocalizationProvider from "../../mock-l10n";
import ItemDetails from
       "../../../src/webextension/manage/components/itemDetails";
import CurrentItem from
       "../../../src/webextension/manage/containers/currentItem";
import {
  ADD_ITEM_STARTING, CANCEL_NEW_ITEM, UPDATE_ITEM_STARTING, REMOVE_ITEM_STARTING
} from "../../../src/webextension/manage/actions";


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("<CurrentItem/>", () => {
  describe("nothing selected", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = mount(
        <Provider store={store}>
          <MockLocalizationProvider>
            <CurrentItem/>
          </MockLocalizationProvider>
        </Provider>
      );
    });

    it("render item", () => {
      expect(wrapper.text()).to.equal("no iTEm sELECTEd");
    });
  });


  describe("new item", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore({...filledState, ui: {
        ...filledState.ui, newItem: true
      }});
      wrapper = mount(
        <Provider store={store}>
          <MockLocalizationProvider>
            <CurrentItem/>
          </MockLocalizationProvider>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(ItemDetails);
      expect(details).to.have.length(1);
      expect(details.prop("fields")).to.equal(undefined);
    });

    it("ADD_ITEM dispatched", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(store.getActions()[0].type).to.equal(ADD_ITEM_STARTING);
    });

    it("CANCEL_NEW_ITEM dispatched", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(store.getActions()[0].type).to.equal(CANCEL_NEW_ITEM);
    });
  });

  describe("item selected", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore(filledState);
      wrapper = mount(
        <Provider store={store}>
          <MockLocalizationProvider>
            <CurrentItem/>
          </MockLocalizationProvider>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(ItemDetails);
      const currentItem = filledState.cache.currentItem;
      expect(details).to.have.length(1);
      expect(details.prop("fields")).to.deep.equal({
        title: currentItem.title,
        username: currentItem.entry.username,
        password: currentItem.entry.password,
      });
    });

    it("UPDATE_ITEM dispatched", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(store.getActions()[0].type).to.equal(UPDATE_ITEM_STARTING);
    });

    it("REMOVE_ITEM dispatched", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(store.getActions()[0].type).to.equal(REMOVE_ITEM_STARTING);
    });
  });
});
