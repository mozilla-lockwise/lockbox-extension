/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount } from "enzyme";
import React from "react";

chai.use(chaiEnzyme);

import Toolbar, { ToolbarSpace } from "../../src/webextension/widgets/toolbar";

describe("widgets > toolbar", () => {
  describe("<Toolbar/>", () => {
    it("render toolbar", () => {
      const wrapper = mount(
        <Toolbar>
          <span>hello</span>
        </Toolbar>
      );
      expect(wrapper.find("span")).to.have.text("hello");
    });
  });

  describe("<ToolbarSpace/>", () => {
    it("render space", () => {
      const wrapper = mount(
        <ToolbarSpace/>
      );
      expect(wrapper.find("span")).to.have.length(1);
    });
  });
});
