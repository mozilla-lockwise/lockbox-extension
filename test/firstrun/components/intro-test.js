/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

import mountWithL10n from "test/mocks/l10n";
import Intro from "src/webextension/firstrun/components/intro";

chai.use(chaiEnzyme());

describe("firstrun > components > <Intro/>", () => {
  it("render <Intro/>", () => {
    const wrapper = mountWithL10n(
      <Intro/>
    );

    expect(wrapper.find("h1")).to.have.text("wELCOMe");
    expect(wrapper.find("h2")).to.have.text("mORe wELCOMe");
  });
});
