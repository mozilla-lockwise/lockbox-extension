/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect } from "chai";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "test/mocks/browser";
import { initialState } from "./mock-redux-state";
import * as actions from "src/webextension/settings/actions";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("settings > actions", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
  });

  it("localReset() dispatched", async () => {
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.type === "reset") {
        return {};
      }

      return null;
    });

    await store.dispatch(actions.localReset());
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      {
        type: actions.LOCAL_RESET_STARTING,
        actionId: dispatched[0].actionId,
      },
      {
        type: actions.LOCAL_RESET_COMPLETED,
        actionId: dispatched[0].actionId,
      },
    ]);
  });

  it("requestLocalReset() dispatched", () => {
    store.dispatch(actions.requestLocalReset());
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      {
        type: actions.SHOW_MODAL,
        id: "local-reset",
        props: {},
      },
    ]);
  });

  it("hideModal() dispatched", () => {
    store.dispatch(actions.hideModal());
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      {
        type: actions.HIDE_MODAL,
      },
    ]);
  });
});
