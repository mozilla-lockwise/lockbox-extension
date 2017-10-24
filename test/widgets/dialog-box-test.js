/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { mount } from "test/enzyme";
import DialogBox from "src/webextension/widgets/dialog-box";

chai.use(chaiEnzyme());
chai.use(sinonChai);

describe("widgets > <DialogBox/>", () => {
  let wrapper, onClick, onClose;
  beforeEach(() => {
    onClick = sinon.spy();
    onClose = sinon.spy();
    wrapper = mount(
      <DialogBox buttonLabels={["ok", "cancel"]} {...{onClick, onClose}}>
        message
      </DialogBox>
    );
  });

  it("render dialog box", () => {
    expect(wrapper.find("div")).to.have.text("message");
  });

  it("onClick + onClose fired for first button", () => {
    wrapper.find("button").first().simulate("click");
    expect(onClick).to.have.been.calledWith(0);
    expect(onClose).to.have.been.calledWith();
  });

  it("onClick + onClose fired for second button", () => {
    wrapper.find("button").last().simulate("click");
    expect(onClick).to.have.been.calledWith(1);
    expect(onClose).to.have.been.calledWith();
  });
});

