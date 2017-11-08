/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

import mountWithL10n from "test/mocks/l10n";
import Homepage from "src/webextension/manage/components/homepage";

chai.use(chaiEnzyme());

describe("manage > components > <Homepage/>", () => {
  it("render with no items", () => {
    const wrapper = mountWithL10n(
      <Homepage count={0}/>
    );

    expect(wrapper).to.contain.text("homepage-no-passwords-title");
  });

  it("render with 5 items", () => {
    const wrapper = mountWithL10n(
      <Homepage count={5}/>
    );

    expect(wrapper).to.contain.text("homepage-some-passwords-title");
  });
});
