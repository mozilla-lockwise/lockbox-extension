/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

chai.use(chaiEnzyme());

import mountWithL10n from "../../mock-l10n";
import Homepage from "../../../src/webextension/manage/components/homepage";

describe("manage > components > <Homepage/>", () => {
  it("render with no items", () => {
    const wrapper = mountWithL10n(
      <Homepage count={0}/>
    );

    expect(wrapper).to.contain.text("homepage-no-passwords");
  });

  it("render with 5 items", () => {
    const wrapper = mountWithL10n(
      <Homepage count={5}/>
    );

    expect(wrapper).to.contain.text("homepage-under-10-passwords");
  });

  it("render with 15 items", () => {
    const wrapper = mountWithL10n(
      <Homepage count={15}/>
    );

    expect(wrapper).to.contain.text("homepage-under-50-passwords");
  });

  it("render with 75 items", () => {
    const wrapper = mountWithL10n(
      <Homepage count={75}/>
    );

    expect(wrapper).to.contain.text("homepage-over-50-passwords");
  });
});
