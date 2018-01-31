/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

import mountWithL10n from "test/mocks/l10n";
import AccountSummaryLabel from "src/webextension/list/manage/components/account-summary-label";

chai.use(chaiEnzyme());

describe("list > manage > components > <AccountSummaryLabel />", () => {
  it("render <AccountSummaryLabel/>", () => {
    const wrapper = mountWithL10n(
      <AccountSummaryLabel displayName="Ellen Ripley"
        avatar="https://avatar.example/c49fd653afb7010bd47d5ef81a95d3977803517d.png"/>
    );

    expect(wrapper.find("span").at(1)).to.have.text("Ellen Ripley");
    expect(wrapper.find("img")).to.have.prop("src").to.equal("https://avatar.example/c49fd653afb7010bd47d5ef81a95d3977803517d.png");
  });

  it("render nothing", () => {
    const wrapper = mountWithL10n(
      <AccountSummaryLabel />
    );

    expect(wrapper.hostNodes()).to.have.length(0);
  });
});
