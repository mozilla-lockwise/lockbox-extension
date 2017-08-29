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

import MockLocalizationProvider from "./mock-l10n";
import App from "../src/webextension/manage/components/app";

const middlewares = [];
const mockStore = configureStore(middlewares);

// Keep this in sync with <src/webextension/manage/reducers.js>.
const initialState = {
  cache: {items: [], currentItem: null, pendingAdd: null},
  ui: {newItem: false},
};

describe("It renders without crashing", () => {
  it("It loads", () => {
    const store = mockStore(initialState);
    mount(
      <Provider store={store}>
        <MockLocalizationProvider>
          <App/>
        </MockLocalizationProvider>
      </Provider>
    );
  });
});
