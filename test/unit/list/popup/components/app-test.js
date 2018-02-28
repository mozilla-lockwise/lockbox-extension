/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

import { initialState } from "../mock-redux-state";
import mountWithL10n from "test/mocks/l10n";
import App from "src/webextension/list/popup/components/app";
import CurrentSelection from
       "src/webextension/list/popup/containers/current-selection";

chai.use(chaiEnzyme());

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("list > popup > components > <App/>", () => {
  it("render app", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <App/>
      </Provider>
    );

    expect(wrapper).to.contain(<CurrentSelection/>);
  });
});
