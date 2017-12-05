/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect } from "chai";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

import { initialState } from "../mock-redux-state";
import mountWithL10n from "test/mocks/l10n";
import { startNewItem } from "src/webextension/list/actions";
import { NEW_ITEM_ID } from "src/webextension/list/common";
import AddItem from "src/webextension/list/manage/containers/add-item";

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("list > manage > containers > <AddItem/>", () => {
  it("startNewItem() dispatched", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <AddItem/>
      </Provider>
    );
    wrapper.simulate("click");
    expect(store.getActions()).to.deep.equal([startNewItem()]);
  });

  it("disabled when editing a new item", () => {
    const store = mockStore({
      ...initialState,
      list: {
        ...initialState.list,
        selectedItemId: NEW_ITEM_ID,
      },
    });
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <AddItem/>
      </Provider>
    );
    wrapper.simulate("click");
    expect(store.getActions()).to.deep.equal([]);
  });
});
