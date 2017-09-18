/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import mountWithL10n from "../../mock-l10n";
import Item from "../../../src/webextension/manage/components/item";

describe("<Item/>", () => {
  let onClick;

  beforeEach(() => {
    onClick = sinon.spy();
  });

  it("render title and username", () => {
    const wrapper = mountWithL10n(
      <Item title="title" username="username" onClick={onClick}/>
    );
    expect(wrapper.find("div").at(0).text()).to.equal("title");
    expect(wrapper.find("div").at(1).text()).to.equal("username");
  });

  it("render blank", () => {
    const wrapper = mountWithL10n(
      <Item onClick={onClick}/>
    );
    expect(wrapper.find("div").at(0).text()).to.equal("item-summary-no-title");
    expect(wrapper.find("div").at(1).text()).to.equal(
      "item-summary-no-username"
    );
  });

  it("onClick called", () => {
    const wrapper = mountWithL10n(
      <Item title="title" username="username" onClick={onClick}/>
    );
    wrapper.simulate("click");
    expect(onClick).to.have.been.calledWith();
  });
});
