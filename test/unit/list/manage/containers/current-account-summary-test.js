/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import { initialState } from "../mock-redux-state";
import mountWithL10n from "test/mocks/l10n";
import * as actions from "src/webextension/list/actions";
import CurrentAccountSummary from
       "src/webextension/list/manage/containers/current-account-summary";

chai.use(chaiEnzyme());

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("list > manage > containers > <CurrentAccountSummary/>", () => {
  describe("authenticated mode", () => {
    const avatar = "https://avatar.example/c49fd653afb7010bd47d5ef81a95d3977803517d.png";
    let store, wrapper;

    beforeEach(() => {
      store = mockStore({
        ...initialState,
        account: {
          mode: "authenticated",
          uid: "1234",
          email: "eripley@wyutani.com",
          displayName: "Ellen Ripley",
          avatar,
        },
      });
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CurrentAccountSummary/>
        </Provider>
      );
    });

    it("render account summary", () => {
      expect(wrapper.find("span").at(1)).to.have.text("Ellen Ripley");
      expect(wrapper.find("img")).to.have.prop("src").to.equal(avatar);
    });

    it("openAccountPage() dispatched", () => {
      wrapper.find("button").simulate("click");
      wrapper.findWhere((x) => x.prop("id") === "account-summary-account")
             .find("button").simulate("click");
      expect(store.getActions()[0]).to.deep.equal({
        type: actions.OPEN_ACCOUNT_PAGE,
      });
    });

    it("openOptions() dispatched", () => {
      wrapper.find("button").simulate("click");
      wrapper.findWhere((x) => x.prop("id") === "account-summary-options")
             .find("button").simulate("click");
      expect(store.getActions()[0]).to.deep.equal({
        type: actions.OPEN_OPTIONS,
      });
    });

    it("signout() dispatched", () => {
      wrapper.find("button").simulate("click");
      wrapper.findWhere((x) => x.prop("id") === "account-summary-signout")
             .find("button").simulate("click");
      expect(store.getActions()[0]).to.deep.equal({
        type: actions.SIGNOUT_STARTING,
        actionId: store.getActions()[0].actionId,
      });
    });
  });

  it("render empty in guest mode", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <CurrentAccountSummary/>
      </Provider>
    );

    expect(wrapper.hostNodes()).to.have.length(0);
  });
});
