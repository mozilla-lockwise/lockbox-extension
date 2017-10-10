/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { initialState } from "../mock-redux-state";
import mountWithL10n from "../../mock-l10n";
import GoHome from "../../../src/webextension/manage/containers/go-home";
import { SELECT_ITEM_STARTING }
       from "../../../src/webextension/manage/actions";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("manage > containers > <GoHome/>", () => {
  it("selectItem() dispatched", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <GoHome/>
      </Provider>
    );
    wrapper.simulate("click");
    expect(store.getActions()[0]).to.deep.include({
      type: SELECT_ITEM_STARTING,
      id: null,
    });
  });
});
