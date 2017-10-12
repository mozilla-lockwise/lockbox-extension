/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount } from "enzyme";
import React from "react";

chai.use(chaiEnzyme);

import TextArea from "src/webextension/widgets/text-area";

describe("widgets > <TextArea/>", () => {
  it("render textarea", () => {
    const wrapper = mount(<TextArea value="text" onChange={() => {}}/>);
    expect(wrapper.find("textarea")).to.have.prop("value", "text");
  });

  it("merge classNames", () => {
    const wrapper = mount(
      <TextArea className="foo" value="text" onChange={() => {}}/>
    );
    expect(wrapper.find("textarea").prop("className")).to.match(
      /^browser-style \S+ foo$/
    );
  });

  it("focus() focuses textarea", () => {
    const wrapper = mount(
      <TextArea value="text" onChange={() => {}}/>
    );
    wrapper.instance().focus();
    expect(wrapper.find("textarea").instance()).to.equal(
      document.activeElement, "the element was not focused"
    );
  });
});
