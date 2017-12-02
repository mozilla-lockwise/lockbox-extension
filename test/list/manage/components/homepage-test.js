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

chai.use(chaiEnzyme());

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("list > manage > components > <Homepage/>", () => {
  it("render with no items", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <Homepage count={0}/>
      </Provider>
    );

    expect(wrapper.find("h1").at(0)).to.contain.text("welcOMe to lOcKboX");
  });

  it("render with 5 items", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <Homepage count={5}/>
      </Provider>
    );

    expect(wrapper.find("h1").at(0)).to.contain.text(
      "YoU have X enTrieS in YoUr lOcKboX"
    );
  });
});
