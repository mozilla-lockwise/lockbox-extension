/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import updateBrowserAction from
       "../../src/webextension/background/browser-action";

describe("background > browser action", () => {
  let openView;

  beforeEach(() => {
    openView = sinon.spy();
    updateBrowserAction.__Rewire__("openView", openView);
  });

  afterEach(() => {
    updateBrowserAction.__ResetDependency__("openView");
  });

  it("uninitialized data store", async() => {
    await updateBrowserAction({initialized: false});
    browser.browserAction.onClicked.mockFireListener();
    expect(openView).to.have.been.calledWith("firstrun");
  });

  it("locked data store", async() => {
    await updateBrowserAction({initialized: true, locked: true});
    expect(browser.browserAction.getPopup()).to.eventually.equal(
      browser.extension.getURL("popup/unlock/index.html")
    );
  });

  it("unlocked data store", async() => {
    await updateBrowserAction({initialized: true, locked: false});
    browser.browserAction.onClicked.mockFireListener();
    expect(openView).to.have.been.calledWith("manage");
  });
});
