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
import mountWithL10n from "./mock-l10n";

import Button from "../src/webextension/widgets/button";
import FilterInput from "../src/webextension/widgets/filter-input";
import Input from "../src/webextension/widgets/input";
import ScrollingList from "../src/webextension/widgets/scrolling-list";
import TextArea from "../src/webextension/widgets/text-area";

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
      const wrapper = mountWithL10n(<FilterInput value="text"/>);
      const realInput = wrapper.find("input");
      expect(realInput.prop("value")).to.equal("text");
    });

    it("reset button clears filter", () => {
      const wrapper = mountWithL10n(<FilterInput/>);
      simulateTyping(wrapper.find("input"), "text");
      wrapper.find("button").simulate("click");

      const realInput = wrapper.find("input");
      expect(realInput.prop("value")).to.equal("");
    });

    it("onChange fired on input", () => {
      const onChange = sinon.spy();
      const wrapper = mountWithL10n(<FilterInput onChange={onChange}/>);
      simulateTyping(wrapper.find("input"), "text");

      expect(onChange).to.have.been.calledWith("text");
    });

    it("onChange fired on reset", () => {
      const onChange = sinon.spy();
      const wrapper = mountWithL10n(<FilterInput onChange={onChange}/>);
      simulateTyping(wrapper.find("input"), "text");
      wrapper.find("button").simulate("click");

      expect(onChange).to.have.been.calledWith("");
    });

    it("onChange not fired if no text changed", () => {
      const onChange = sinon.spy();
      const wrapper = mountWithL10n(<FilterInput onChange={onChange}/>);
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

    it("merge classNames", () => {
      const wrapper = mount(
        <Input className="foo" value="text" onChange={() => {}}/>
      );
      const realInput = wrapper.find("input");
      expect(realInput.prop("className")).to.match(/ foo$/);
    });
  });

  describe("<ScrollingList/>", () => {
    let wrapper, onItemSelected;

    beforeEach(() => {
      onItemSelected = sinon.spy();
    });

    describe("empty list", () => {
      beforeEach(() => {
        wrapper = mount(
          <ScrollingList data={[]} onItemSelected={onItemSelected}>
            {({item, ...props}) => {
              return (
                <li {...props}>{item.name}</li>
              );
            }}
          </ScrollingList>
        );
      });

      it("render list", () => {
        expect(wrapper.find("ul")).to.have.length(1);
        expect(wrapper.find("li")).to.have.length(0);
      });

      it("onItemSelected() not dispatched on arrow down", () => {
        wrapper.simulate("keydown", {key: "ArrowDown"});
        expect(onItemSelected).to.have.callCount(0);
      });

      it("onItemSelected() not dispatched on arrow up", () => {
        wrapper.simulate("keydown", {key: "ArrowUp"});
        expect(onItemSelected).to.have.callCount(0);
      });
    });

    describe("filled list", () => {
      const data = [
        {id: "1", name: "item 1"},
        {id: "2", name: "item 2"},
        {id: "3", name: "item 3"},
      ];

      beforeEach(() => {
        wrapper = mount(
          <ScrollingList data={data} onItemSelected={onItemSelected}>
            {({item, ...props}) => {
              return (
                <li {...props}>{item.name}</li>
              );
            }}
          </ScrollingList>
        );
      });

      it("render list", () => {
        expect(wrapper.find("ul")).to.have.length(1);
        expect(wrapper.find("li")).to.have.length(3);
      });

      it("onItemSelected() dispatched on clicking item", () => {
        wrapper.find("li").first().simulate("click");
        expect(onItemSelected).to.have.been.calledWith("1");
      });

      it("onItemSelected() dispatched on arrow down", () => {
        wrapper.setProps({selected: "1"});
        wrapper.simulate("keydown", {key: "ArrowDown"});
        expect(onItemSelected).to.have.been.calledWith("2");
      });

      it("onItemSelected() dispatched on arrow up", () => {
        wrapper.setProps({selected: "3"});
        wrapper.simulate("keydown", {key: "ArrowUp"});
        expect(onItemSelected).to.have.been.calledWith("2");
      });

      it("onItemSelected() dispatched on arrow down for no selection", () => {
        wrapper.simulate("keydown", {key: "ArrowDown"});
        expect(onItemSelected).to.have.been.calledWith("1");
      });

      it("onItemSelected() dispatched on arrow up for no selection", () => {
        wrapper.simulate("keydown", {key: "ArrowUp"});
        expect(onItemSelected).to.have.been.calledWith("1");
      });

      it("onItemSelected() not dispatched on arrow down for last item", () => {
        wrapper.setProps({selected: "3"});
        wrapper.simulate("keydown", {key: "ArrowDown"});
        expect(onItemSelected).to.have.callCount(0);
      });

      it("onItemSelected() not dispatched on arrow up for first item", () => {
        wrapper.setProps({selected: "1"});
        wrapper.simulate("keydown", {key: "ArrowUp"});
        expect(onItemSelected).to.have.callCount(0);
      });

      it("onItemSelected() not dispatched for irrelevant key press", () => {
        wrapper.simulate("keydown", {key: "Enter"});
        expect(onItemSelected).to.have.callCount(0);
      });
    });
  });

  describe("<TextArea/>", () => {
    it("render textarea", () => {
      const wrapper = mount(<TextArea value="text" onChange={() => {}}/>);
      const realTextArea = wrapper.find("textarea");
      expect(realTextArea.prop("value")).to.equal("text");
    });

    it("merge classNames", () => {
      const wrapper = mount(
        <TextArea className="foo" value="text" onChange={() => {}}/>
      );
      const realTextArea = wrapper.find("textarea");
      expect(realTextArea.prop("className")).to.equal("browser-style foo");
    });
  });
});
