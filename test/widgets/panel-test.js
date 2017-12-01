/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { mount } from "test/enzyme";
import Panel, { PanelHeader, PanelBody, PanelFooter } from
       "src/webextension/widgets/panel";

chai.use(chaiEnzyme());
chai.use(sinonChai);

describe("widgets > panel", () => {
  describe("<PanelHeader/>", () => {
    it("render header", () => {
      const wrapper = mount(<PanelHeader>header</PanelHeader>);
      expect(wrapper.find("span")).to.have.text("header");
      expect(wrapper.find("header").prop("className")).to.match(
        /^\S*panel-header\S*$/
      );
      expect(wrapper.find("button")).to.have.length(0);
    });

    it("merge classNames", () => {
      const wrapper = mount(<PanelHeader className="foo"/>);
      expect(wrapper.find("header").prop("className")).to.match(
        /^\S*panel-header\S* foo$/
      );
    });

    it("onBack fired", () => {
      const onBack = sinon.spy();
      const wrapper = mount(<PanelHeader onBack={onBack}>header</PanelHeader>);
      wrapper.find("button").simulate("click");
      expect(onBack).to.have.callCount(1);
    });
  });

  describe("<PanelBody/>", () => {
    it("render body", () => {
      const wrapper = mount(<PanelBody>body</PanelBody>);
      expect(wrapper.find("main")).to.have.text("body");
      expect(wrapper.find("main").prop("className")).to.match(
        /^\S*panel-body\S*$/
      );
    });

    it("merge classNames", () => {
      const wrapper = mount(<PanelBody className="foo"/>);
      expect(wrapper.find("main").prop("className")).to.match(
        /^\S*panel-body\S* foo$/
      );
    });
  });

  describe("<PanelFooter/>", () => {
    it("render footer", () => {
      const wrapper = mount(<PanelFooter>footer</PanelFooter>);
      expect(wrapper.find("footer")).to.have.text("footer");
      expect(wrapper.find("footer").prop("className")).to.match(
        /^\S*panel-footer\S*$/
      );
    });

    it("merge classNames", () => {
      const wrapper = mount(<PanelFooter className="foo"/>);
      expect(wrapper.find("footer").prop("className")).to.match(
        /^\S*panel-footer\S* foo$/
      );
    });
  });

  describe("<Panel/>", () => {
    it("render panel", () => {
      const wrapper = mount(
        <Panel>
          <PanelHeader>header</PanelHeader>
          <PanelBody>body</PanelBody>
          <PanelFooter>footer</PanelFooter>
        </Panel>
      );
      expect(wrapper.find("article").find("header")).to.have.text("header");
      expect(wrapper.find("article").find("main")).to.have.text("body");
      expect(wrapper.find("article").find("footer")).to.have.text("footer");
      expect(wrapper.find("article").prop("className")).to.match(
        /^\S*panel\S*$/
      );
    });

    it("merge classNames", () => {
      const wrapper = mount(
        <Panel className="foo">
          <PanelBody>body</PanelBody>
        </Panel>);
      expect(wrapper.find("article").prop("className")).to.match(
        /^\S*panel\S* foo$/
      );
    });
  });
});
