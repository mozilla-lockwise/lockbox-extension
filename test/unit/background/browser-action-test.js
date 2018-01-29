/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import "test/mocks/browser";
import updateBrowserAction from "src/webextension/background/browser-action";
import { GUEST, UNAUTHENTICATED, AUTHENTICATED } from "src/webextension/background/accounts";

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe("background > browser action", () => {
  let openView;
  const datastoreBase = {
    unlock: () => {},
  };

  beforeEach(() => {
    openView = sinon.spy();
    updateBrowserAction.__Rewire__("openView", openView);
  });

  afterEach(() => {
    updateBrowserAction.__ResetDependency__("openView");
  });

  it("uninitialized data store", async () => {
    await updateBrowserAction({
      account: { mode: GUEST },
      datastore: { ...datastoreBase, initialized: false },
    });
    browser.browserAction.onClicked.mockFireListener();
    expect(openView).to.have.been.calledWith("firstrun");
  });

  it("locked data store (as GUEST)", async () => {
    await updateBrowserAction({
      account: { mode: GUEST },
      datastore: { ...datastoreBase, initialized: true, locked: true },
    });
    expect(browser.browserAction.getPopup()).to.eventually.equal(
      browser.extension.getURL("popup/list/index.html")
    );
  });

  it("locked data store (as UNAUTHENTICATED)", async () => {
    await updateBrowserAction({
      account: { mode: UNAUTHENTICATED },
      datastore: { ...datastoreBase, initialized: true, locked: true },
    });
    expect(browser.browserAction.getPopup()).to.eventually.equal(
      browser.extension.getURL("popup/unlock/index.html")
    );
  });

  it("unlocked data store (as GUEST)", async () => {
    await updateBrowserAction({
      account: { mode: GUEST },
      datastore: { ...datastoreBase, initialized: true, locked: false },
    });
    expect(browser.browserAction.getPopup()).to.eventually.equal(
      browser.extension.getURL("popup/list/index.html")
    );
  });

  it("unlocked data store (as AUTHENTICATED)", async () => {
    await updateBrowserAction({
      account: { mode: AUTHENTICATED },
      datastore: { ...datastoreBase, initialized: true, locked: false },
    });
    expect(browser.browserAction.getPopup()).to.eventually.equal(
      browser.extension.getURL("popup/list/index.html")
    );
  });
});
