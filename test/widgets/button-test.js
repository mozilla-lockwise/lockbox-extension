/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount } from "enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiEnzyme);
chai.use(sinonChai);

import Button from "src/webextension/widgets/button";

describe("widgets > <Button/>", () => {
  it("render button", () => {
    const wrapper = mount(<Button>click me</Button>);
    expect(wrapper.find("button")).to.have.text("click me");
    expect(wrapper.find("button").prop("className")).to.match(
      /^browser-style \S+$/
    );
  });

  it("merge classNames", () => {
    const wrapper = mount(<Button className="foo">click me</Button>);
    expect(wrapper.find("button").prop("className")).to.match(
      /^browser-style \S+ foo$/
    );
  });

  it("onClick fired", () => {
    const onClick = sinon.spy();
    const wrapper = mount(<Button onClick={onClick}>click me</Button>);
    wrapper.find("button").simulate("click");
    expect(onClick).to.have.callCount(1);
  });

  it("focus() focuses button", () => {
    const wrapper = mount(<Button>click me</Button>);
    wrapper.instance().focus();
    expect(wrapper.find("button").instance()).to.equal(
      document.activeElement, "the element was not focused"
    );
  });
});
