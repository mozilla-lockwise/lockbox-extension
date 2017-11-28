/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount } from "enzyme";
import React from "react";
import sinon from "sinon";

chai.use(chaiEnzyme);

import ButtonStack from "src/webextension/widgets/button-stack";

describe("widgets > <ButtonStack/>", () => {
  beforeEach(() => {
    sinon.spy(ButtonStack.prototype, "render");
  });

  afterEach(() => {
    ButtonStack.prototype.render.restore();
  });

  it("render stack", () => {
    const wrapper = mount(
      <ButtonStack>
        <button>click me</button>
      </ButtonStack>
    );
    expect(wrapper.find("button")).to.have.text("click me");
  });

  it("select child", async () => {
    const wrapper = mount(
      <ButtonStack>
        <button>click me</button>
        <button>click me too</button>
      </ButtonStack>
    );

    expect(wrapper.instance().selectedIndex).to.equal(0);
    expect(wrapper.find("span").at(0)).to.have.prop("data-selected");
    expect(wrapper.find("span").at(1)).to.not.have.prop("data-selected");

    wrapper.instance().selectedIndex = 1;
    wrapper.update();

    expect(wrapper.instance().selectedIndex).to.equal(1);
    expect(wrapper.find("span").at(0)).to.not.have.prop("data-selected");
    expect(wrapper.find("span").at(1)).to.have.prop("data-selected");
  });
});
