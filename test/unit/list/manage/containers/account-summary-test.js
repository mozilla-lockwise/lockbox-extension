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
import AccountSummary from "src/webextension/list/manage/containers/account-summary";

chai.use(chaiEnzyme());

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("list > manage > containers > <AccountSummary/>", () => {
  it("render in authenticated mode", () => {
    const store = mockStore({
      ...initialState,
      account: {
        mode: "authenticated",
        uid: "1234",
        email: "eripley@wyutani.com",
        displayName: "Ellen Ripley",
        avatar: "https://avatar.example/c49fd653afb7010bd47d5ef81a95d3977803517d.png",
      },
    });
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <AccountSummary />
      </Provider>
    );

    expect(wrapper.find("span").at(1)).to.have.text("Ellen Ripley");
    expect(wrapper.find("img")).to.have.prop("src").to.equal("https://avatar.example/c49fd653afb7010bd47d5ef81a95d3977803517d.png");
  });
  it("render empty in guest mode", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <AccountSummary />
      </Provider>
    );

    expect(wrapper.hostNodes()).to.have.length(0);
  });
});
