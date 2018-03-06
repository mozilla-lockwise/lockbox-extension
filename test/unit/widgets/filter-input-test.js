/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import chaiFocus from "test/chai-focus";
import { simulateTyping } from "test/common";
import mountWithL10n, { mountWithL10nIntoDOM } from "test/mocks/l10n";
import FilterInput from "src/webextension/widgets/filter-input";

chai.use(chaiEnzyme());
chai.use(chaiFocus);
chai.use(sinonChai);

describe("widgets > <FilterInput/>", () => {
  it("render input", () => {
    const wrapper = mountWithL10n(<FilterInput value="some text"/>);
    expect(wrapper.find("input")).to.have.prop("value", "some text");
    expect(wrapper.childAt(0).prop("className")).to.match(
      /^\S+filter\S+ \S+input-wrapper\S+$/
    );
  });

  it("render disabled input", () => {
    const wrapper = mountWithL10n(
      <FilterInput value="some text" disabled={true}/>
    );
    expect(wrapper.find("input")).to.have.prop("disabled", true);
    expect(wrapper.find("button")).to.have.prop("disabled", true);
    expect(wrapper.childAt(0).prop("className")).to.match(
      /^\S+filter\S+ \S+input-wrapper\S+ \S+disabled\S+$/
    );
  });

  it("merge classNames", () => {
    const wrapper = mountWithL10n(
      <FilterInput className="foo" value="some text"/>
    );
    expect(wrapper.childAt(0).prop("className")).to.match(
      /^\S+filter\S+ \S+input-wrapper\S+ foo$/
    );
  });

  it("reset button clears filter", () => {
    const wrapper = mountWithL10n(<FilterInput/>);
    simulateTyping(wrapper.find("input"), "some text");
    wrapper.find("button").simulate("click");

    expect(wrapper.find("input")).to.have.prop("value", "");
  });

  it("onChange fired on input", () => {
    const onChange = sinon.spy();
    const wrapper = mountWithL10n(<FilterInput onChange={onChange}/>);
    simulateTyping(wrapper.find("input"), "text");

    expect(onChange).to.have.been.calledWith("text");
  });

  it("onChange fired on reset", () => {
    const onChange = sinon.spy();
    const wrapper = mountWithL10n(<FilterInput onChange={onChange}/>);
    simulateTyping(wrapper.find("input"), "text");
    wrapper.find("button").simulate("click");

    expect(onChange).to.have.been.calledWith("");
  });

  it("onChange not fired if no text changed", () => {
    const onChange = sinon.spy();
    const wrapper = mountWithL10n(<FilterInput onChange={onChange}/>);
    wrapper.find("button").simulate("click");

    expect(onChange).to.have.callCount(0);
  });

  it("focus() focuses input", () => {
    const wrapper = mountWithL10nIntoDOM(
      <FilterInput onChange={() => {}}/>
    );
    wrapper.instance().focus();
    expect(wrapper.find("input")).to.be.focused();
  });
});
