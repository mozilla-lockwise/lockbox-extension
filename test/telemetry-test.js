/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import * as telemetry from "../src/webextension/telemetry";

describe("telemetry", () => {
  let onMessage;

  beforeEach(() => {
    browser.runtime.onMessage.addListener(onMessage = sinon.stub().returns({}));
  });

  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
  });

  it("recordEvent()", async() => {
    const result = await telemetry.recordEvent("category", "method", "object",
                                               {extra: "value"});
    expect(result).to.deep.equal({});
    expect(onMessage).to.have.been.calledWith({
      type: "proxy_telemetry_event",
      category: "category",
      method: "method",
      object: "object",
      extra: {extra: "value"},
    });
  });
});
