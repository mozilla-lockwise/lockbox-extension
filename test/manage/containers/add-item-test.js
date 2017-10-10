/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

import { initialState } from "../mock-redux-state";
import mountWithL10n from "../../mock-l10n";
import AddItem from "../../../src/webextension/manage/containers/add-item";
import { startNewItem } from "../../../src/webextension/manage/actions";

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("manage > containers > <AddItem/>", () => {
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
});
