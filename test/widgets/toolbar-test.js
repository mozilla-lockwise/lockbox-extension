/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

import { mount } from "test/enzyme";
import Toolbar, { ToolbarSpace } from "src/webextension/widgets/toolbar";

chai.use(chaiEnzyme());

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
