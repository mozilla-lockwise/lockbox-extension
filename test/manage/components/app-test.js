/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount } from "enzyme";
import React from "react";
import ReactDOM from "react-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

chai.use(chaiEnzyme());

import MockLocalizationProvider from "../../mock-l10n";
import App from "../../../src/webextension/manage/components/app";
import AddItem from "../../../src/webextension/manage/containers/addItem";
import AllItems from "../../../src/webextension/manage/containers/allItems";
import CurrentItem from
       "../../../src/webextension/manage/containers/currentItem";

const middlewares = [];
const mockStore = configureStore(middlewares);

// Keep this in sync with <src/webextension/manage/reducers.js>.
const initialState = {
  cache: {items: [], currentItem: null, pendingAdd: null},
  ui: {newItem: false},
};

describe("<App/>", () => {
  it("render app", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MockLocalizationProvider>
          <App/>
        </MockLocalizationProvider>
      </Provider>
    );

    expect(wrapper).to.contain(<AddItem/>);
    expect(wrapper).to.contain(<AllItems/>);
    expect(wrapper).to.contain(<CurrentItem/>);
  });
});
