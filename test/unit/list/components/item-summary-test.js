/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import { Localized } from "fluent-react";
import React from "react";

import mountWithL10n from "test/mocks/l10n";
import { NEW_ITEM_ID } from "src/webextension/list/common";
import ItemSummary from "src/webextension/list/components/item-summary";

chai.use(chaiEnzyme());

describe("list > components > <ItemSummary/>", () => {
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
    expect(wrapper.find("button")).to.have.length(0);
  });

  it("render new item", () => {
    const wrapper = mountWithL10n(
      <ItemSummary id={NEW_ITEM_ID}/>
    );
    expect(wrapper.find(Localized).at(0)).to.have.prop(
      "id", "item-summary-new-title"
    );
    expect(wrapper.find(Localized).at(1)).to.have.prop(
      "id", "item-summary-new-username"
    );
    expect(wrapper.find("button")).to.have.length(0);
  });

  it("render item verbosely", () => {
    const wrapper = mountWithL10n(
      <ItemSummary verbose title="title" username="username"/>
    );
    expect(wrapper.find(Localized).at(0)).to.have.prop(
      "id", "item-summary-title"
    );
    expect(wrapper.find(Localized).at(1)).to.have.prop(
      "id", "item-summary-username"
    );
    expect(wrapper.find("button")).to.have.length(2);
  });
});
