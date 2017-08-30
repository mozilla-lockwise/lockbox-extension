/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";
import { mount } from "enzyme";
import React from "react";
import ReactDOM from "react-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

import { initialState } from "../mock-redux-state";
import MockLocalizationProvider from "../../mock-l10n";
import AddItem from "../../../src/webextension/manage/containers/addItem";
import { startNewItem } from "../../../src/webextension/manage/actions";

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("<AddItem/>", () => {
  it("START_NEW_ITEM dispatched", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MockLocalizationProvider>
          <AddItem/>
        </MockLocalizationProvider>
      </Provider>
    );
    wrapper.simulate("click");
    expect(store.getActions()).to.deep.equal([startNewItem()]);
  });
});
