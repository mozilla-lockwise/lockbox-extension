/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import waitUntil from "async-wait-until";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";

import { simulateTyping } from "test/common";
import mountWithL10n from "test/mocks/l10n";
import UnlockPrompt from
       "src/webextension/popup/unlock/components/unlock-prompt";

chai.use(chaiEnzyme());

describe("popup > unlock > components > <UnlockPrompt/>", () => {
  let wrapper;

  beforeEach(() => {
    sinon.spy(UnlockPrompt.prototype, "render");
    sinon.stub(UnlockPrompt.prototype, "_navigate");
    wrapper = mountWithL10n(<UnlockPrompt/>);
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.type === "unlock" && msg.password !== "n0str0m0") {
        throw new Error("bad password");
      }
    });
  });

  afterEach(() => {
    UnlockPrompt.prototype.render.restore();
    UnlockPrompt.prototype._navigate.restore();
    browser.runtime.onMessage.mockClearListener();
  });

  it("render prompt", () => {
    expect(wrapper.find("h1")).to.have.text("uNLOCk yOUr lOCKBOx");
  });

  it("submit correct password", () => {
    simulateTyping(wrapper.find("input"), "n0str0m0");
    wrapper.find('button[type="submit"]').simulate("submit");
  });

  it("submit incorrect password", async () => {
    simulateTyping(wrapper.find("input"), "jonesy");
    wrapper.find('button[type="submit"]').simulate("submit");
    await waitUntil(() => UnlockPrompt.prototype.render.callCount === 3);
    expect(wrapper).to.have.state(
      "error", "unlock-prompt-err-invalid-pwd"
    );
  });
});
