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
import Homepage from "src/webextension/list/manage/components/homepage";
import AccountDetails from "src/webextension/list/manage/containers/account-details";

chai.use(chaiEnzyme());

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("list > manage > components > <Homepage/>", () => {
  it("render homepage with welcome", () => {
    const wrapper = mountWithL10n(
      <Homepage/>
    );

    expect(wrapper.find("h1")).to.contain.text("tHe sIMPLe wAy tO sTORE...");
    expect(wrapper).to.contain(AccountDetails);
  });
});
