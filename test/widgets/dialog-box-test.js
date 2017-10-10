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

import DialogBox from "../../src/webextension/widgets/dialog-box";

describe("widgets > <DialogBox/>", () => {
  let wrapper, onClickPrimary, onClickSecondary;
  beforeEach(() => {
    onClickPrimary = sinon.spy();
    onClickSecondary = sinon.spy();
    wrapper = mount(
      <DialogBox text="message" primaryButtonLabel="ok"
                 secondaryButtonLabel="cancel"
                 {...{onClickPrimary, onClickSecondary}}/>
    );
  });

  it("render dialog box", () => {
    expect(wrapper.find("div")).to.have.text("message");
  });

  it("onClickPrimary fired", () => {
    wrapper.find("button").first().simulate("click");
    expect(onClickPrimary).to.have.callCount(1);
  });

  it("onClickSecondary fired", () => {
    wrapper.find("button").last().simulate("click");
    expect(onClickSecondary).to.have.callCount(1);
  });
});

