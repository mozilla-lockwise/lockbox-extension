/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";
import React from "react";

import mountWithL10n from "../../mock-l10n";
import ItemSummary from
       "../../../src/webextension/manage/components/item-summary";

describe("manage > components > <ItemSummary/>", () => {
  it("render title and username", () => {
    const wrapper = mountWithL10n(
      <ItemSummary title="title" username="username"/>
    );
    expect(wrapper.find("div > div").at(0).text()).to.equal("title");
    expect(wrapper.find("div > div").at(1).text()).to.equal("username");
  });

  it("render blank", () => {
    const wrapper = mountWithL10n(
      <ItemSummary/>
    );
    expect(wrapper.find("div > div").at(0).text()).to.equal(
      "item-summary-no-title"
    );
    expect(wrapper.find("div > div").at(1).text()).to.equal(
      "item-summary-no-username"
    );
  });
});
