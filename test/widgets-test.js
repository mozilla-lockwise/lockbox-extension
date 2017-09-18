/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import { mount } from "enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { simulateTyping } from "./common";

import Button from "../src/webextension/widgets/button";
import FilterInput from "../src/webextension/widgets/filter-input";
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

  describe("<FilterInput/>", () => {
    it("render input", () => {
      const wrapper = mount(<FilterInput value="text"/>);
      const realInput = wrapper.find("input");
      expect(realInput.prop("value")).to.equal("text");
    });

    it("reset button clears filter", () => {
      const wrapper = mount(<FilterInput/>);
      simulateTyping(wrapper.find("input"), "text");
      wrapper.find("button").simulate("click");

      const realInput = wrapper.find("input");
      expect(realInput.prop("value")).to.equal("");
    });

    it("onChange fired on input", () => {
      const onChange = sinon.spy();
      const wrapper = mount(<FilterInput onChange={onChange}/>);
      simulateTyping(wrapper.find("input"), "text");

      expect(onChange).to.have.been.calledWith("text");
    });

    it("onChange fired on reset", () => {
      const onChange = sinon.spy();
      const wrapper = mount(<FilterInput onChange={onChange}/>);
      simulateTyping(wrapper.find("input"), "text");
      wrapper.find("button").simulate("click");

      expect(onChange).to.have.been.calledWith("");
    });

    it("onChange not fired if no text changed", () => {
      const onChange = sinon.spy();
      const wrapper = mount(<FilterInput onChange={onChange}/>);
      wrapper.find("button").simulate("click");

      expect(onChange).to.have.callCount(0);
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
