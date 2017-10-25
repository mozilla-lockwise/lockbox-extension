/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { Localized } from "fluent-react";
import React from "react";

import mountWithL10n from "test/mocks/l10n";
import { NEW_ITEM_ID } from "src/webextension/manage/common";
import ItemSummary from "src/webextension/manage/components/item-summary";

chai.use(chaiEnzyme());

describe("manage > components > <ItemSummary/>", () => {
  it("render existing item", () => {
    const wrapper = mountWithL10n(
      <ItemSummary title="title" username="username"/>
    );
    expect(wrapper.find(Localized).at(0)).to.have.prop(
      "id", "item-summary-title"
    );
    expect(wrapper.find(Localized).at(1)).to.have.prop(
      "id", "item-summary-username"
    );
  });

  it("render new item", () => {
    const wrapper = mountWithL10n(
      <ItemSummary id={NEW_ITEM_ID}/>
    );
    expect(wrapper.find(Localized).at(0)).to.have.prop(
      "id", "item-summary-new-title"
    );
    expect(wrapper.find(Localized).at(1)).to.have.prop(
      "id", "item-summary-username"
    );
  });
});
