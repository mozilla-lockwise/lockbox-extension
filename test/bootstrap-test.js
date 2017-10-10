/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import waitUntil from "async-wait-until";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import bootstrap from "../src/bootstrap";

describe("bootstrap", () => {
  it("startup()", async() => {
    const startup = bootstrap.__get__("startup");
    const webextStartup = sinon.stub().resolves({browser});
    startup({webExtension: {
      startup: webextStartup,
    }});

    await waitUntil(() => webextStartup.callCount === 1);
    const result = await browser.runtime.sendMessage({type: "telemetry_event"});
    expect(result).to.deep.equal({});
  });

  // These functions are currently no-ops, so we just need to test that they
  // exist.

  it("shutdown()", () => {
    const shutdown = bootstrap.__get__("shutdown");
    shutdown();
  });

  it("install()", () => {
    const install = bootstrap.__get__("install");
    install();
  });

  it("uninstall()", () => {
    const uninstall = bootstrap.__get__("uninstall");
    uninstall();
  });
});
