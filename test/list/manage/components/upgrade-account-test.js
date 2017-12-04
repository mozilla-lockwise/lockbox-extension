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
import UpgradeAccount from "src/webextension/list/manage/components/upgrade-account";

chai.use(chaiEnzyme());

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("list > manage > components > <UpgradeAccount/>", () => {
  it("render in guest mode", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <UpgradeAccount />
      </Provider>
    );

    expect(wrapper.find("h2")).to.have.text("uPGRADe");
    expect(wrapper.find("p")).to.have.text("uPGRADe yOUr lOCKBOx");
    expect(wrapper.find("button#homepage-upgrade-action-create")).to.have.text("cREATe aCCOUNt");
    expect(wrapper.find("button#homepage-upgrade-action-signin")).to.have.text("sIGn iN");
  });

  it("render empty in authenticated mode", () => {
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
        <UpgradeAccount />
      </Provider>
    );

    expect(wrapper.hostNodes()).to.have.length(0);
  });

  describe("actions", () => {
    let store, wrapper;
    let spy;

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <UpgradeAccount />
        </Provider>
      );

      spy = sinon.spy(() => ({}));
      browser.runtime.onMessage.addListener(spy);
    });
    afterEach(() => {
      browser.runtime.onMessage.mockClearListener();
      spy.reset();
    });

    it('click on "create account"', async () => {
      wrapper.find("button#homepage-upgrade-action-create").simulate("click");

      await waitUntil(() => spy.callCount === 1);
      expect(spy).to.have.been.calledWith({
        type: "upgrade",
        action: "signup",
      });
    });

    it('click on "sign in"', async () => {
      wrapper.find("button#homepage-upgrade-action-signin").simulate("click");

      await waitUntil(() => spy.callCount === 1);
      expect(spy).to.have.been.calledWith({
        type: "upgrade",
        action: "signin",
      });
    });
  });
});
