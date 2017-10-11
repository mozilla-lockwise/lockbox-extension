/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

chai.use(chaiEnzyme);

import mountWithL10n from "test/mock-l10n";
import PasswordInput from "src/webextension/widgets/password-input";

describe("widgets > <PasswordInput/>", () => {
  it("render input", () => {
    const wrapper = mountWithL10n(
      <PasswordInput value="my password" onChange={() => {}}/>
    );
    expect(wrapper.find("input")).to.have.prop("value", "my password");
  });

  it("show/hide button toggles password visibility", () => {
    const wrapper = mountWithL10n(
      <PasswordInput value="password" onChange={() => {}}/>
    );
    const realInput = wrapper.find("input");
    const button = wrapper.find("button");

    expect(realInput).to.have.prop("type", "password");
    button.simulate("click");
    expect(realInput).to.have.prop("type", "text");
    button.simulate("click");
    expect(realInput).to.have.prop("type", "password");
  });

  it("focus() focuses input", () => {
    const wrapper = mountWithL10n(
      <PasswordInput value="password" onChange={() => {}}/>
    );
    wrapper.instance().focus();
    const realInput = wrapper.find("input");
    expect(realInput.matchesElement(document.activeElement)).to.equal(
      true, "the element was not focused"
    );
  });
});
