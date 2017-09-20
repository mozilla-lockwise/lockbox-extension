/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import { initialState, filledState } from "../mock-redux-state";
import mountWithL10n from "../../mock-l10n";
import ItemDetails from
       "../../../src/webextension/manage/components/item-details";
import CurrentItem from
       "../../../src/webextension/manage/containers/current-item";
import * as actions from "../../../src/webextension/manage/actions";


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("<CurrentItem/>", () => {
  beforeEach(() => {
    browser.runtime.onMessage.addListener(() => ({}));
  });

  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
  });

  describe("nothing selected", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentItem/>
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
        ...filledState.ui, newItem: true,
      }});
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentItem/>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(ItemDetails);
      expect(details).to.have.length(1);
      expect(details.prop("fields")).to.deep.equal({
        title: "",
        origin: "",
        username: "",
        password: "",
        notes: "",
      });
    });

    it("addItem() dispatched", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(store.getActions()[0]).to.deep.include({
        type: actions.ADD_ITEM_STARTING,
        item: {
          title: "",
          origins: [],
          id: undefined,
          entry: {
            kind: "login",
            password: "",
            username: "",
            notes: "",
          },
        },
      });
    });

    it("cancelNewItem() dispatched", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(store.getActions()[0]).to.deep.equal({
        type: actions.CANCEL_NEW_ITEM,
      });
    });
  });

  describe("item selected", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore(filledState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentItem/>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(ItemDetails);
      const currentItem = filledState.cache.currentItem;
      expect(details).to.have.length(1);
      expect(details.prop("fields")).to.deep.equal({
        title: currentItem.title,
        origin: currentItem.origins[0],
        username: currentItem.entry.username,
        password: currentItem.entry.password,
        notes: currentItem.entry.notes,
      });
    });

    it("updateItem() dispatched", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(store.getActions()[0]).to.deep.include({
        type: actions.UPDATE_ITEM_STARTING,
        item: {
          title: "title 1",
          origins: ["origin 1"],
          id: "1",
          entry: {
            kind: "login",
            password: "password 1",
            username: "username 1",
            notes: "notes 1",
          },
        },
      });
    });

    it("removeItem() dispatched", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(store.getActions()[0]).to.deep.include({
        type: actions.REMOVE_ITEM_STARTING,
        id: "1",
      });
    });
  });

  describe("item selected (no origin)", () => {
    let store, wrapper;
    let state = {
      ...filledState,
      cache: {
        ...filledState.cache,
        currentItem: {
          ...filledState.cache.currentItem,
          origins: [],
        },
      },
    };

    beforeEach(() => {
      store = mockStore(state);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentItem/>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(ItemDetails);
      const currentItem = state.cache.currentItem;
      expect(details).to.have.length(1);
      expect(details.prop("fields")).to.deep.equal({
        title: currentItem.title,
        origin: "",
        username: currentItem.entry.username,
        password: currentItem.entry.password,
        notes: currentItem.entry.notes,
      });
    });
  });
});
