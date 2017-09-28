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
import { NEW_ITEM_ID } from "../../../src/webextension/manage/common";
import EditItemDetails from
       "../../../src/webextension/manage/components/edit-item-details";
import ItemDetails from
       "../../../src/webextension/manage/components/item-details";
import CurrentSelection from
       "../../../src/webextension/manage/containers/current-selection";
import * as actions from "../../../src/webextension/manage/actions";


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("<CurrentSelection/>", () => {
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
          <CurrentSelection/>
        </Provider>
      );
    });

    it("render item", () => {
      expect(wrapper.text()).to.include("homepage-no-passwords");
    });
  });

  describe("item selected", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore(filledState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentSelection/>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(ItemDetails);
      expect(details).to.have.length(1);
    });

    it("editCurrentItem() dispatched", () => {
      wrapper.find("button").at(0).simulate("click");
      expect(store.getActions()[0]).to.deep.equal({
        type: actions.EDIT_CURRENT_ITEM,
      });
    });

    it("removeItem() dispatched", () => {
      wrapper.find("button").at(1).simulate("click");
      expect(store.getActions()[0]).to.deep.include({
        type: actions.REMOVE_ITEM_STARTING,
        id: "1",
      });
    });
  });

  describe("edit new item", () => {
    let store, wrapper;

    beforeEach(() => {
      const state = {
        ...filledState,
        cache: {
          ...filledState.cache,
          currentItem: null,
        },
        ui: {
          ...filledState.ui,
          editing: true,
          selectedItemId: NEW_ITEM_ID,
        },
      };
      store = mockStore(state);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentSelection/>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(EditItemDetails);
      expect(details).to.have.length(1);
      expect(details.prop("fields")).to.deep.equal({
        title: "",
        origin: "",
        username: "",
        password: "",
        notes: "",
      });
    });

    it("first field focused", () => {
      const firstField = wrapper.find("input").at(0);
      expect(firstField.matchesElement(document.activeElement)).to.equal(
        true, "the element was not focused"
      );
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

    it("cancelEditing() dispatched", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(store.getActions()[0]).to.deep.equal({
        type: actions.CANCEL_EDITING,
      });
    });
  });

  describe("edit existing item", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore({...filledState, ui: {
        ...filledState.ui, editing: true,
      }});
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentSelection/>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(EditItemDetails);
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

    it("first field focused", () => {
      const firstField = wrapper.find("input").at(0);
      expect(firstField.matchesElement(document.activeElement)).to.equal(
        true, "the element was not focused"
      );
    });

    it("updateItem() dispatched", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(store.getActions()[0]).to.deep.include({
        type: actions.UPDATE_ITEM_STARTING,
        item: {
          title: "title 1",
          origins: ["origin-1.com"],
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

    it("cancelEditing() dispatched", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(store.getActions()[0]).to.deep.include({
        type: actions.CANCEL_EDITING,
      });
    });
  });

  describe("edit existing item (no origin)", () => {
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
      ui: {
        ...filledState.ui,
        editing: true,
      },
    };

    beforeEach(() => {
      store = mockStore(state);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentSelection/>
        </Provider>
      );
    });

    it("render item", () => {
      const details = wrapper.find(EditItemDetails);
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
