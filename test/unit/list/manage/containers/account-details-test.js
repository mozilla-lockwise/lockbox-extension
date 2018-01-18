/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import sinon from "sinon";
import waitUntil from "async-wait-until";

import { initialState } from "../mock-redux-state";
import mountWithL10n from "test/mocks/l10n";
import AccountDetails from "src/webextension/list/manage/containers/account-details";
import LinkAccount from "src/webextension/list/manage/components/link-account";
import AccountLinked from "src/webextension/list/manage/components/account-linked";

chai.use(chaiEnzyme());

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("list > manage > containers > <AccountDetails/>", () => {
  it("render in guest mode", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <AccountDetails />
      </Provider>
    );

    expect(wrapper).to.contain(LinkAccount);
  });

  it("render in authenticated mode", () => {
    const store = mockStore({
      ...initialState,
      account: {
        mode: "authenticated",
        uid: "1234",
        email: "eripley@wyutani.com",
      },
    });
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <AccountDetails />
      </Provider>
    );

    expect(wrapper).to.contain(AccountLinked);
  });

  describe("actions", () => {
    let store, wrapper;
    let spy;

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <AccountDetails />
        </Provider>
      );

      spy = sinon.spy(() => ({}));
      browser.runtime.onMessage.addListener(spy);
    });
    afterEach(() => {
      browser.runtime.onMessage.mockClearListener();
      spy.resetHistory();
    });

    it('click on "create account"', async () => {
      wrapper.findWhere((x) => x.prop("id") === "homepage-linkaccount-action-create")
             .find("button").simulate("click");

      await waitUntil(() => spy.callCount === 2);
      expect(spy).to.have.been.calledWith({
        type: "upgrade_account",
        action: "signup",
      });
    });

    it('click on "sign in"', async () => {
      wrapper.findWhere((x) => x.prop("id") === "homepage-linkaccount-action-signin")
             .find("button").simulate("click");

      await waitUntil(() => spy.callCount === 2);
      expect(spy).to.have.been.calledWith({
        type: "upgrade_account",
        action: "signin",
      });
    });
  });
});
