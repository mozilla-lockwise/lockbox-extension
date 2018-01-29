/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { mount } from "test/enzyme";
import { ExternalLink } from "src/webextension/widgets/link";

chai.use(chaiEnzyme());
chai.use(sinonChai);

describe("widgets > <ExternalLink/>", () => {
  it("render", () => {
    const wrapper = mount(
      <ExternalLink onClick={() => {}}>external link</ExternalLink>
    );
    expect(wrapper.find("a")).to.have.text("external link");
    expect(wrapper.find("a")).prop("className").to.match(
      /^\S+external\S+$/
    );
  });

  it("merge className", () => {
    const wrapper = mount(
      <ExternalLink onClick={() => {}}
                    className="extra-extra">external link</ExternalLink>
    );
    expect(wrapper.find("a")).to.have.text("external link");
    expect(wrapper.find("a")).prop("className").to.match(
      /^\S+external\S+ extra-extra$/
    );
  });

  it("calls onClick handler", () => {
    const spyClick = sinon.spy();
    const wrapper = mount(
      <ExternalLink onClick={spyClick}>external link</ExternalLink>
    );
    wrapper.find("a").simulate("click");

    expect(spyClick).to.have.callCount(1);
  });
});
