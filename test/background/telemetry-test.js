/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import getAuthorization from "src/webextension/background/authorization";
import * as telemetry from "src/webextension/background/telemetry";

describe("background > telemetry", () => {
  let onMessage;

  beforeEach(() => {
    browser.runtime.onMessage.addListener(onMessage = sinon.stub().returns({}));
  });

  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
  });

  describe("no fxa uid", () => {
    it("recordEvent()", async() => {
      const result = await telemetry.recordEvent("category", "method",
                                                 "object");
      expect(result).to.deep.equal({});
      expect(onMessage).to.have.been.calledWith({
        type: "telemetry_event",
        category: "category",
        method: "method",
        object: "object",
        extra: undefined,
      });
    });

    it("recordEvent() with extra", async() => {
      const result = await telemetry.recordEvent("category", "method", "object",
                                                 {extra: "value"});
      expect(result).to.deep.equal({});
      expect(onMessage).to.have.been.calledWith({
        type: "telemetry_event",
        category: "category",
        method: "method",
        object: "object",
        extra: {extra: "value"},
      });
    });
  });

  describe("with fxa uid", () => {
    before(() => {
      // Pretend we're signed in.
      getAuthorization().info = {
        uid: "1234",
      };
    });

    after(() => {
      getAuthorization().info = undefined;
    });

    it("recordEvent() (with fxa uid)", async() => {
      const result = await telemetry.recordEvent("category", "method",
                                                 "object");
      expect(result).to.deep.equal({});
      expect(onMessage).to.have.been.calledWith({
        type: "telemetry_event",
        category: "category",
        method: "method",
        object: "object",
        extra: {fxauid: "1234"},
      });
    });

    it("recordEvent() (with fxa uid and extras)", async() => {
      const result = await telemetry.recordEvent("category", "method", "object",
                                                 {extra: "value"});
      expect(result).to.deep.equal({});
      expect(onMessage).to.have.been.calledWith({
        type: "telemetry_event",
        category: "category",
        method: "method",
        object: "object",
        extra: {extra: "value", fxauid: "1234"},
      });
    });
  });
});
