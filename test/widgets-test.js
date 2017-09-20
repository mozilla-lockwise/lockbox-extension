/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";
import { mount } from "enzyme";
import React from "react";

import Button from "../src/webextension/widgets/button";
import Input from "../src/webextension/widgets/input";

describe("widgets", () => {
  describe("<Button/>", () => {
    it("render button", () => {
      const wrapper = mount(<Button>click me</Button>);
      const realButton = wrapper.find("button");
      expect(realButton.text()).to.equal("click me");
      expect(realButton.prop("className")).to.equal("browser-style");
    });

    it("merge classNames", () => {
      const wrapper = mount(<Button className="foo">click me</Button>);
      const realButton = wrapper.find("button");
      expect(realButton.prop("className")).to.equal("browser-style foo");
    });
  });

  describe("<Input/>", () => {
    it("render input", () => {
      const wrapper = mount(<Input value="text" onChange={() => {}}/>);
      const realInput = wrapper.find("input");
      expect(realInput.prop("value")).to.equal("text");
    });
  });
});
