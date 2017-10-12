/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Services */

require("babel-polyfill");

import waitUntil from "async-wait-until";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import bootstrap from "src/bootstrap";

describe("bootstrap", () => {
  describe("startup()", () => {
    const startup = bootstrap.__get__("startup");
    let webextStartup;

    beforeEach(() => {
      webextStartup = sinon.stub().resolves({browser});
    });

    afterEach(() => {
      // Clear the listeners set in <src/bootstrap.js>.
      browser.runtime.onMessage.mockClearListener();
    });

    it("web extension loaded and telemetry recorded", async() => {
      const webextStartup = sinon.stub().resolves({browser});
      startup({webExtension: {
        startup: webextStartup,
      }});

      await waitUntil(() => webextStartup.callCount === 1);
      const result = await browser.runtime.sendMessage(
        {type: "telemetry_event"}
      );
      expect(result).to.deep.equal({});
    });

    it("re-registering telemetry doesn't throw", () => {
      sinon.stub(Services.telemetry, "registerEvents").throws(new Error(
        "Attempt to register event that is already registered."
      ));
      expect(() => startup({webExtension: {
        startup: webextStartup,
      }})).to.not.throw();
      Services.telemetry.registerEvents.restore();
    });

    it("other errors do throw", () => {
      sinon.stub(Services.telemetry, "registerEvents").throws(new Error(
        "something else"
      ));
      expect(() => startup({webExtension: {
        startup: webextStartup,
      }})).to.throw();
      Services.telemetry.registerEvents.restore();
    });
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
