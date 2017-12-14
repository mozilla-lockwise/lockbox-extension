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
      <AccountSummaryLabel email="eripley@wyutani.com"/>
    );

    expect(wrapper.find("span")).to.have.text("eripley@wyutani.com");
  });

  it("render nothing", () => {
    const wrapper = mountWithL10n(
      <AccountSummaryLabel />
    );

    expect(wrapper.hostNodes()).to.have.length(0);
  });
});
