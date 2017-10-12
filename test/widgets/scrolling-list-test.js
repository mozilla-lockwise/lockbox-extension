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

import ScrollingList from "src/webextension/widgets/scrolling-list";

describe("widgets > <ScrollingList/>", () => {
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

    describe("onItemSelected()", () => {
      it("not dispatched on arrow down", () => {
        wrapper.simulate("keydown", {key: "ArrowDown"});
        expect(onItemSelected).to.have.callCount(0);
      });

      it("not dispatched on arrow up", () => {
        wrapper.simulate("keydown", {key: "ArrowUp"});
        expect(onItemSelected).to.have.callCount(0);
      });
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
          {({name}) => {
            return (
              <div>{name}</div>
            );
          }}
        </ScrollingList>
      );
    });

    it("render list", () => {
      expect(wrapper.find("ul")).to.have.length(1);
      expect(wrapper.find("li")).to.have.length(3);
    });

    describe("onItemSelected()", () => {
      it("dispatched on clicking item", () => {
        wrapper.find("li").first().simulate("mousedown");
        expect(onItemSelected).to.have.been.calledWith("1");
      });

      it("dispatched on arrow down", () => {
        wrapper.setProps({selected: "1"});
        wrapper.simulate("keydown", {key: "ArrowDown"});
        expect(onItemSelected).to.have.been.calledWith("2");
      });

      it("dispatched on arrow up", () => {
        wrapper.setProps({selected: "3"});
        wrapper.simulate("keydown", {key: "ArrowUp"});
        expect(onItemSelected).to.have.been.calledWith("2");
      });

      it("dispatched on arrow down for no selection", () => {
        wrapper.simulate("keydown", {key: "ArrowDown"});
        expect(onItemSelected).to.have.been.calledWith("1");
      });

      it("dispatched on arrow up for no selection", () => {
        wrapper.simulate("keydown", {key: "ArrowUp"});
        expect(onItemSelected).to.have.been.calledWith("1");
      });

      it("not dispatched on arrow down for last item", () => {
        wrapper.setProps({selected: "3"});
        wrapper.simulate("keydown", {key: "ArrowDown"});
        expect(onItemSelected).to.have.callCount(0);
      });

      it("not dispatched on arrow up for first item", () => {
        wrapper.setProps({selected: "1"});
        wrapper.simulate("keydown", {key: "ArrowUp"});
        expect(onItemSelected).to.have.callCount(0);
      });

      it("not dispatched for irrelevant key press", () => {
        wrapper.simulate("keydown", {key: "Enter"});
        expect(onItemSelected).to.have.callCount(0);
      });
    });

    describe("scrolling", () => {
      it("scroll up into view", () => {
        const scrollIntoView = sinon.spy();
        wrapper.find("ul").instance().scrollTop = 42;
        wrapper.find("li").at(0).instance().scrollIntoView = scrollIntoView;
        wrapper.setProps({selected: "1"});

        expect(scrollIntoView).to.have.been.calledWith({
          behavior: "smooth", block: "start",
        });
      });

      it("scroll down into view", () => {
        const scrollIntoView = sinon.spy();
        wrapper.find("ul").instance().scrollTop = -42;
        wrapper.find("li").at(2).instance().scrollIntoView = scrollIntoView;
        wrapper.setProps({selected: "3"});

        expect(scrollIntoView).to.have.been.calledWith({
          behavior: "smooth", block: "end",
        });
      });

      it("does not scroll if selection is unchanged", () => {
        const scrollIntoView = sinon.spy();
        wrapper.find("ul").instance().scrollTop = -42;
        wrapper.find("li").at(2).instance().scrollIntoView = scrollIntoView;
        wrapper.setProps({selected: "3"});
        scrollIntoView.reset();
        wrapper.setProps({selected: "3"});

        expect(scrollIntoView).to.have.callCount(0);
      });
    });
  });
});
