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

  it("show/hide button toggles password visibility", async() => {
    const wrapper = mountWithL10n(
      <PasswordInput value="password" onChange={() => {}}/>
    );
    expect(wrapper.find("input")).to.have.prop("type", "password");

    wrapper.find("button").simulate("click");
    expect(wrapper.find("input")).to.have.prop("type", "text");

    wrapper.find("button").simulate("click");
    expect(wrapper.find("input")).to.have.prop("type", "password");
  });

  it("focus() focuses input", () => {
    const wrapper = mountWithL10n(
      <PasswordInput value="password" onChange={() => {}}/>
    );
    wrapper.instance().focus();
    expect(wrapper.find("input").instance()).to.equal(
      document.activeElement, "the element was not focused"
    );
  });
});
