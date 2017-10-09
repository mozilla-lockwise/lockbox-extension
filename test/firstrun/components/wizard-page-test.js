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

import WizardPage from
       "../../../src/webextension/firstrun/components/wizard-page";

describe("<WizardPage/>", () => {
  let onSubmit, wrapper;

  beforeEach(() => {
    onSubmit = sinon.spy();
    wrapper = mount(
      <WizardPage title="my title" submitLabel="click me" onSubmit={onSubmit}>
        <p>{"we're children!"}</p>
        <p>{"we're children!!"}</p>
      </WizardPage>
    );
  });

  it("render page", () => {
    expect(wrapper.find("h1")).to.have.text("my title");
    expect(wrapper.find("p").first()).to.have.text("we're children!");
    expect(wrapper.find("p").last()).to.have.text("we're children!!");
    expect(wrapper.find("button")).to.have.text("click me");
  });

  it("onSubmit called", () => {
    wrapper.find("button").simulate("submit");
    expect(onSubmit).to.have.callCount(1);
  });
});
