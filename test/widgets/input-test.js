/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

import chaiFocus from "test/chai-focus";
import { mount, mountIntoDOM } from "test/enzyme";
import Input from "src/webextension/widgets/input";

chai.use(chaiEnzyme());
chai.use(chaiFocus);

describe("widgets > <Input/>", () => {
  it("render input", () => {
    const wrapper = mount(<Input value="some text" onChange={() => {}}/>);
    expect(wrapper.find("input")).to.have.prop("value", "some text");
    expect(wrapper.find("input").prop("className")).to.match(
      /^\S+input\S+$/
    );
  });

  it("merge classNames", () => {
    const wrapper = mount(
      <Input className="foo" value="some text" onChange={() => {}}/>
    );
    expect(wrapper.find("input").prop("className")).to.match(
      /^\S+input\S+ foo$/
    );
  });

  it("focus() focuses input", () => {
    const wrapper = mountIntoDOM(
      <Input className="foo" value="some text" onChange={() => {}}/>
    );
    wrapper.instance().focus();
    expect(wrapper.find("input")).to.be.focused();
  });
});
