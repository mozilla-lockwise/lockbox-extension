/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { mount } from "enzyme";
import PropTypes from "prop-types";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiEnzyme);
chai.use(sinonChai);

import Wizard from "src/webextension/firstrun/components/wizard";

function Page1({next}) {
  return (<button onClick={() => next({prop: "value"})}>click me</button>);
}

Page1.propTypes = {
  next: PropTypes.func,
};

function Page2({next, prop}) {
  return (<button onClick={() => next()}>click me too</button>);
}

Page2.propTypes = {
  next: PropTypes.func,
  prop: PropTypes.any,
};

describe("firstrun > components > <Wizard/>", () => {
  let wrapper;
  beforeEach(() => {
    sinon.spy(browser.runtime, "sendMessage");
    wrapper = mount(
      <Wizard pages={[Page1, Page2]}/>
    );
  });

  afterEach(() => {
    browser.runtime.sendMessage.restore();
  });

  it("render wizard", () => {
    expect(wrapper.find("button")).to.have.text("click me");
  });

  it("next() loads next page", () => {
    wrapper.find("button").simulate("click");
    expect(wrapper).to.have.state("prop", "value");
    expect(wrapper.find("button")).to.have.text("click me too");
    expect(wrapper.find(Page2)).to.have.prop("prop", "value");
  });

  it("next() on last page closes view", () => {
    wrapper.find("button").simulate("click");
    wrapper.find("button").simulate("click");
    expect(wrapper.find("button")).to.have.length(0);
    expect(browser.runtime.sendMessage).to.have.been.calledWith({
      type: "close_view", name: "firstrun",
    });
  });
});
