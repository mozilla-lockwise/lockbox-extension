/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount } from "enzyme";
import React from "react";

chai.use(chaiEnzyme);

import Input from "src/webextension/widgets/input";

describe("widgets > <Input/>", () => {
  it("render input", () => {
    const wrapper = mount(<Input value="some text" onChange={() => {}}/>);
    expect(wrapper.find("input")).to.have.prop("value", "some text");
  });

  it("apply className", () => {
    const wrapper = mount(
      <Input className="foo" value="some text" onChange={() => {}}/>
    );
    expect(wrapper.find("input").prop("className")).to.equal("foo");
  });

  it("focus() focuses input", () => {
    const wrapper = mount(
      <Input className="foo" value="some text" onChange={() => {}}/>
    );
    wrapper.instance().focus();
    const realInput = wrapper.find("input");
    expect(realInput.matchesElement(document.activeElement)).to.equal(
      true, "the element was not focused"
    );
  });
});
