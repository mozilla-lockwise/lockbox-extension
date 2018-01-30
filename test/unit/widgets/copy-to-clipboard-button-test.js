/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import chaiFocus from "test/chai-focus";
import mountWithL10n from "test/mocks/l10n";
import ButtonStack from "src/webextension/widgets/button-stack";
import CopyToClipboardButton from
       "src/webextension/widgets/copy-to-clipboard-button";

chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.use(chaiFocus);

describe("widgets > <CopyToClipboardButton/>", () => {
  let mockCopy;

  beforeEach(() => {
    mockCopy = sinon.spy();
    CopyToClipboardButton.__Rewire__("copy", mockCopy);
  });

  afterEach(() => {
    CopyToClipboardButton.__ResetDependency__("copy");
  });

  it("render button", () => {
    const wrapper = mountWithL10n(<CopyToClipboardButton value="hi there"/>);
    expect(wrapper.find("button")).to.have.text("cOPy");
    expect(wrapper.find("button").prop("className")).to.match(
      /^\S*button\S* \S*ghost-theme\S* \S*normal-size\S* \S*copy-button\S*$/
    );
    expect(wrapper.find(ButtonStack).prop("selectedIndex")).to.equal(0);
  });

  it("render label", () => {
    const wrapper = mountWithL10n(<CopyToClipboardButton value="hi there"/>);
    wrapper.setState({copied: true});
    const label = wrapper.findWhere((x) => {
      return x.prop("id") === "copy-to-clipboard-copied";
    }).find("span");
    expect(label).to.have.text("cOPIEd");
    expect(label.prop("className")).to.match(/\S*copied-label\S*$/);
    expect(wrapper.find(ButtonStack).prop("selectedIndex")).to.equal(1);
  });

  it("copy fired", () => {
    const wrapper = mountWithL10n(<CopyToClipboardButton value="hi there"/>);
    wrapper.find("button").simulate("click");
    expect(mockCopy).to.have.callCount(1);
    expect(wrapper.find(ButtonStack).prop("selectedIndex")).to.equal(1);
  });

  it("onCopy fired", () => {
    const onCopy = sinon.spy();
    const wrapper = mountWithL10n(
      <CopyToClipboardButton value="hi there" onCopy={onCopy}/>
    );
    wrapper.find("button").simulate("click");
    expect(mockCopy).to.have.callCount(1);
    expect(onCopy).to.have.callCount(1);
  });

  it("timeout fired", () => {
    // We don't use sinon's useFakeTimers() here since it doesn't work with our
    // test setup.
    const realSetTimeout = window.setTimeout;
    window.setTimeout = (f) => f();

    const wrapper = mountWithL10n(<CopyToClipboardButton value="hi there"/>);
    wrapper.find("button").simulate("click");
    expect(mockCopy).to.have.callCount(1);
    expect(wrapper.find(ButtonStack).prop("selectedIndex")).to.equal(0);

    window.setTimeout = realSetTimeout;
  });
});
