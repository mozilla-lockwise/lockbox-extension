/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Services, ADDON_INSTALL, ADDON_UPGRADE, ADDON_UNINSTALL */

import waitUntil from "async-wait-until";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import "test/mocks/xpcom";
// XXX: We don't really need to inject this into global scope.
import "test/mocks/browser";
import bootstrap from "src/bootstrap";

chai.use(sinonChai);

describe("bootstrap", () => {
  const REMEMBER_SIGNONS_PREF = "signon.rememberSignons";
  const ORIGINAL_REMEMBER_SIGNONS_PREF =
        "extensions.lockbox.originalRememberSignons";

  describe("startup()", () => {
    const startup = bootstrap.__get__("startup");
    let webextStartup;

    beforeEach(() => {
      webextStartup = sinon.stub().resolves({browser});
    });

    afterEach(() => {
      // Clear the listeners set in <src/bootstrap.js>.
      browser.runtime.onMessage.mockClearListener();
      browser.runtime.onConnect.mockClearListener();
    });

    it("web extension loaded and telemetry recorded", async () => {
      startup({webExtension: {
        startup: webextStartup,
      }});

      await waitUntil(() => webextStartup.callCount === 1);
      let result;
      result = await browser.runtime.sendMessage(
        {type: "telemetry_event"}
      );
      expect(result).to.deep.equal({});

      result = await browser.runtime.sendMessage(
        {type: "telemetry_scalar"}
      );
      expect(result).to.deep.equal({});
    });

    it("re-registering telemetry doesn't throw", async () => {
      sinon.stub(Services.telemetry, "registerEvents").throws(new Error(
        "Attempt to register event that is already registered."
      ));
      expect(() => startup({webExtension: {
        startup: webextStartup,
      }})).to.not.throw();
      Services.telemetry.registerEvents.restore();

      await waitUntil(() => webextStartup.callCount === 1);
    });

    it("re-registering scalar doesn't throw", async () => {
      sinon.stub(Services.telemetry, "registerScalars").throws(new Error(
        "Attempt to register scalar that is already registered."
      ));
      expect(() => startup({webExtension: {
        startup: webextStartup,
      }})).to.not.throw();
      Services.telemetry.registerScalars.restore();

      await waitUntil(() => webextStartup.callCount === 1);
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

  describe("shutdown()", () => {
    const shutdown = bootstrap.__get__("shutdown");

    // This function is currently a no-op, so we just need to test that it
    // exists.
    it("does nothing", () => {
      shutdown();
    });
  });

  describe("install()", () => {
    const install = bootstrap.__get__("install");
    const dispatcher = bootstrap.__get__("dispatcher");

    beforeEach(() => {
      sinon.spy(dispatcher, "record");
    });

    afterEach(() => {
      dispatcher.record.restore();
      Services.prefs.mockResetPrefs();
    });

    it("sets signons.rememberSingons on install", () => {
      Services.prefs.setBoolPref(REMEMBER_SIGNONS_PREF, true);
      install(null, ADDON_INSTALL);
      expect(Services.prefs.getBoolPref(REMEMBER_SIGNONS_PREF)).to.equal(false);
      expect(Services.prefs.getBoolPref(ORIGINAL_REMEMBER_SIGNONS_PREF))
            .to.equal(true);
      expect(dispatcher.record).to.have.been.calledWith({
        type: "extension_installed",
      });
    });

    it('dispatches "extension_upgraded" event on upgrade', () => {
      install({ newVersion: "0.1.2", oldVersion: "0.1.1" }, ADDON_UPGRADE);
      expect(dispatcher.record).to.have.been.calledWith({
        type: "extension_upgraded",
        version: "0.1.2",
        oldVersion: "0.1.1",
      });
    });

    it("does nothing on other events", () => {
      install();
      expect(Services.prefs.prefHasUserValue(REMEMBER_SIGNONS_PREF))
            .to.equal(false);
      expect(Services.prefs.prefHasUserValue(ORIGINAL_REMEMBER_SIGNONS_PREF))
            .to.equal(false);
    });
  });

  describe("uninstall()", () => {
    const uninstall = bootstrap.__get__("uninstall");

    afterEach(() => {
      Services.prefs.mockResetPrefs();
    });

    it("resets signons.rememberSignons on uninstall", () => {
      Services.prefs.setBoolPref(ORIGINAL_REMEMBER_SIGNONS_PREF, true);
      uninstall(null, ADDON_UNINSTALL);
      expect(Services.prefs.getBoolPref(REMEMBER_SIGNONS_PREF)).to.equal(true);
      expect(Services.prefs.prefHasUserValue(ORIGINAL_REMEMBER_SIGNONS_PREF))
            .to.equal(false);
    });

    it("does nothing on other events", () => {
      Services.prefs.setBoolPref(REMEMBER_SIGNONS_PREF, false);
      Services.prefs.setBoolPref(ORIGINAL_REMEMBER_SIGNONS_PREF, true);
      uninstall();
      expect(Services.prefs.getBoolPref(REMEMBER_SIGNONS_PREF))
            .to.equal(false);
      expect(Services.prefs.getBoolPref(ORIGINAL_REMEMBER_SIGNONS_PREF))
            .to.equal(true);
    });
  });


  describe("EventDispatcher", () => {
    const EventDispatcher = bootstrap.__get__("EventDispatcher");
    let dispatcher, port;

    beforeEach(() => {
      dispatcher = new EventDispatcher();
      port = {
        postMessage: sinon.spy(),
      };
    });
    afterEach(() => {
      port = undefined;
      dispatcher = undefined;
    });

    it("constructs", () => {
      expect(dispatcher).to.have.property("pendingEvents").to.deep.equal([]);
    });

    it("records event; saves for later", () => {
      dispatcher.record({
        type: "extension_installed",
      });
      expect(dispatcher).to.have.property("pendingEvents").to.deep.equal([{
        type: "extension_installed",
      }]);

      dispatcher.connect(port);
      expect(dispatcher).to.have.property("port").to.equal(port);
      expect(dispatcher).to.have.property("pendingEvents").to.deep.equal([]);
      expect(port.postMessage).to.have.been.calledWith({
        type: "extension_installed",
      });
    });

    it("records event; posts immediately", () => {
      dispatcher.connect(port);
      expect(dispatcher).to.have.property("port").to.equal(port);
      expect(dispatcher).to.have.property("pendingEvents").to.deep.equal([]);

      dispatcher.record({
        type: "extension_installed",
      });
      expect(dispatcher).to.have.property("pendingEvents").to.deep.equal([]);
      expect(port.postMessage).to.have.been.calledWith({
        type: "extension_installed",
      });
    });
  });
});
