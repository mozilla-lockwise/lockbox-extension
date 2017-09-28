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
import ItemSummary from
       "../../../src/webextension/manage/components/item-summary";
import AllItems from "../../../src/webextension/manage/containers/all-items";
import { SELECT_ITEM_STARTING } from "../../../src/webextension/manage/actions";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("<AllItems/>", () => {
  beforeEach(() => {
    browser.runtime.onMessage.addListener(() => ({}));
  });

  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
  });

  describe("empty state", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <AllItems/>
        </Provider>
      );
    });

    it("render items", () => {
      expect(wrapper.find(ItemSummary)).to.have.length(0);
    });
  });

  describe("filled state", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore(filledState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <AllItems/>
        </Provider>
      );
    });

    it("render items", () => {
      const expectedTitle = filledState.cache.currentItem.title;
      expect(wrapper.find(ItemSummary)).to.have.length(3);
      expect(wrapper.find("li").filterWhere(
        (x) => x.prop("data-selected")
      ).find(ItemSummary).prop("title")).to.equal(expectedTitle);
    });

    it("selectItem() dispatched", () => {
      wrapper.find(ItemSummary).at(0).simulate("mousedown");
      expect(store.getActions()[0].type).to.equal(SELECT_ITEM_STARTING);
    });
  });

  describe("filled state (with filters)", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore({
        ...filledState,
        ui: {...filledState.ui, filter: ["2"]},
      });
      wrapper = mountWithL10n(
        <Provider store={store}>
          <AllItems/>
        </Provider>
      );
    });

    it("render items", () => {
      expect(wrapper.find(ItemSummary)).to.have.length(1);
    });
  });
});
