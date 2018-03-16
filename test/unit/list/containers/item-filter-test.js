/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import { simulateTyping } from "test/common";
import mountWithL10n from "test/mocks/l10n";
import { filledState } from "../manage/mock-redux-state";
import { FILTER_ITEMS } from "src/webextension/list/actions";
import ItemFilter from "src/webextension/list/containers/item-filter";

chai.use(chaiEnzyme());

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("list > containers > <ItemFilter/>", () => {
  let store, wrapper;

  beforeEach(() => {
    store = mockStore({
      ...filledState,
      list: {
        ...filledState.list,
        filter: "filter",
      },
    });
    wrapper = mountWithL10n(
      <Provider store={store}>
        <ItemFilter/>
      </Provider>
    );
  });

  it("filter rendered", () => {
    expect(wrapper.find("input")).to.have.prop("value", "filter");
  });

  it("filterItems() dispatched on text input", () => {
    simulateTyping(wrapper.find("input"), "text");

    expect(store.getActions()[0]).to.deep.equal({
      type: FILTER_ITEMS,
      filter: "filtertext",
    });
  });

  it("filterItems() dispatched on reset", () => {
    wrapper.find("button").simulate("click");

    expect(store.getActions()[0]).to.deep.equal({
      type: FILTER_ITEMS,
      filter: "",
    });
  });
});
