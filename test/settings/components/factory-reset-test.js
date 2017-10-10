/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

chai.use(chaiEnzyme);

import mountWithL10n from "../../mock-l10n";
import FactoryReset from "../../../src/webextension/settings/components/factory-reset";

describe("settings > <factoryReset />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountWithL10n(<FactoryReset/>);
  });

  it("render reset", () => {
    expect(wrapper.find("h3")).to.have.text("rESEt lOCKBOx");
    expect(wrapper.find("p")).to.have.text("dO tHe fACTORy rESEt");
    expect(wrapper.find("button")).to.have.text("💣💣💣 rESEt aLL! 💣💣💣");
  });
  it("submit click", () => {
    wrapper.find("button").simulate("click");
  });
});
