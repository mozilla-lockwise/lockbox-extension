/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

import chaiFocus from "test/chai-focus";
import mountWithL10n, { mountWithL10nIntoDOM } from "test/mocks/l10n";
import PasswordInput from "src/webextension/widgets/password-input";

chai.use(chaiEnzyme());
chai.use(chaiFocus);

describe("widgets > <PasswordInput/>", () => {
  it("render input", () => {
    const wrapper = mountWithL10n(
      <PasswordInput value="my password" onChange={() => {}}/>
    );
    expect(wrapper.find("input")).to.have.prop("value", "my password");
    expect(wrapper.childAt(0).prop("className")).to.match(
      /^\S+input-wrapper\S+$/
    );
  });

  it("merge classNames", () => {
    const wrapper = mountWithL10n(
      <PasswordInput className="foo" value="some text" onChange={() => {}}/>
    );
    expect(wrapper.childAt(0).prop("className")).to.match(
      /^\S+input-wrapper\S+ foo$/
    );
  });

  it("show/hide button toggles password visibility", async() => {
    const wrapper = mountWithL10n(
      <PasswordInput value="password" onChange={() => {}}/>
    );
    expect(wrapper.find("input")).to.have.prop("type", "password");

    wrapper.find("button").at(0).simulate("click");
    expect(wrapper.find("input")).to.have.prop("type", "text");

    wrapper.find("button").at(1).simulate("click");
    expect(wrapper.find("input")).to.have.prop("type", "password");
  });

  it("focus() focuses input", () => {
    const wrapper = mountWithL10nIntoDOM(
      <PasswordInput value="password" onChange={() => {}}/>
    );
    wrapper.instance().focus();
    expect(wrapper.find("input")).to.be.focused();
  });
});
