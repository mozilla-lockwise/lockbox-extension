/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import sinon from "sinon";

chai.use(chaiEnzyme);

import { initialState } from "../mock-redux-state";
import mountWithL10n from "test/mocks/l10n";
import ConnectedLocalReset, { LocalReset } from "src/webextension/settings/components/local-reset";
import * as actions from "src/webextension/settings/actions";

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("settings > components > <LocalReset />", () => {
  describe("'raw' component", () => {
    let wrapper;
    let onReset;

    beforeEach(() => {
      onReset = sinon.spy();
      wrapper = mountWithL10n(
        <LocalReset onReset={onReset} />
      );
    });

    it("render reset", () => {
      expect(wrapper.find("h3")).to.have.text("rESEt lOCKBOx");
      expect(wrapper.find("p")).to.have.text("dO tHe fACTORy rESEt");
      expect(wrapper.find("button")).to.have.text("💣💣💣 rESEt aLL! 💣💣💣");
    });
  });

  describe("'connected' component", () => {
    let store;
    let wrapper;

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <ConnectedLocalReset />
        </Provider>);
    });

    it("render reset", () => {
      expect(wrapper.find("h3")).to.have.text("rESEt lOCKBOx");
      expect(wrapper.find("p")).to.have.text("dO tHe fACTORy rESEt");
      expect(wrapper.find("button")).to.have.text("💣💣💣 rESEt aLL! 💣💣💣");
    });
    it("submit click", () => {
      wrapper.findWhere((x) => x.prop("id") === "settings-local-reset-button")
             .find("button").simulate("click");
      const dispatched = store.getActions();
      expect(dispatched).to.deep.equal([
        {
          type: actions.SHOW_MODAL,
          id: "local-reset",
          props: {},
        },
      ]);
    });
  });
});
