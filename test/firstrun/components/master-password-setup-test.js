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
import MasterPasswordSetup from
       "src/webextension/firstrun/components/master-password-setup";

chai.use(chaiEnzyme());

describe("firstrun > components > master-password-setup", () => {
  let wrapper;

  beforeEach(() => {
    sinon.spy(MasterPasswordSetup.prototype, "render");
    wrapper = mountWithL10n(<MasterPasswordSetup/>);
    browser.runtime.onMessage.addListener(() => {});
  });

  afterEach(() => {
    MasterPasswordSetup.prototype.render.restore();
    browser.runtime.onMessage.mockClearListener();
  });

  it("render <MasterPasswordSetup/>", () => {
    expect(wrapper.find("h3")).to.have.text("eNTEr mASTEr pASSWORd");
  });

  it("submit matched password", () => {
    simulateTyping(wrapper.find("input[name='password']"), "n0str0m0");
    simulateTyping(wrapper.find("input[name='confirmPassword']"), "n0str0m0");
    wrapper.find('button[type="submit"]').simulate("submit");
  });

  it("submit mismatched password", async() => {
    simulateTyping(wrapper.find("input[name='password']"), "n0str0m0");
    simulateTyping(wrapper.find("input[name='confirmPassword']"), "jonesy");
    wrapper.find('button[type="submit"]').simulate("submit");
    await waitUntil(() => MasterPasswordSetup.prototype.render.callCount === 4);
    expect(wrapper).to.have.state(
      "error", "Passwords do not match"
    );
  });
});
