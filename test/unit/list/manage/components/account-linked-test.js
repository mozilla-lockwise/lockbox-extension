/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

import mountWithL10n from "test/mocks/l10n";
import AccountLinked from "src/webextension/list/manage/components/account-linked";

chai.use(chaiEnzyme());

describe("list > manage > components > <AccountLinked/>", () => {
  it("render", () => {
    const wrapper = mountWithL10n(
      <AccountLinked />
    );

    expect(wrapper.find("h2")).to.have.text("aCCOUNt lINKEd");
    expect(wrapper.find("p")).to.have.text("Praesent commodo cursus magna, vel scelerisque nisl consectetur et.");
  });
});
