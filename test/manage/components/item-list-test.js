/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import mountWithL10n from "test/mocks/l10n";
import ItemList from "src/webextension/manage/components/item-list";
import ItemSummary from "src/webextension/manage/components/item-summary";

chai.use(chaiEnzyme());
chai.use(sinonChai);

describe("manage > components > <ItemList/>", () => {
  let onItemSelected, wrapper;
  const items = [
    {id: "0", title: "title 0", username: "username 0"},
    {id: "1", title: "title 1", username: "username 1"},
    {id: "2", title: "title 2", username: "username 2"},
  ];

  beforeEach(() => {
    onItemSelected = sinon.spy();
    wrapper = mountWithL10n(
      <ItemList items={items} selected={items[0].id}
                onItemSelected={onItemSelected}/>
    );
  });

  it("render all items", () => {
    expect(wrapper.find(ItemSummary)).to.have.length(3);
  });

  it("correct item is selected", () => {
    expect(wrapper.find("li").at(0)).to.have.prop("data-selected", true);
  });

  it("onItemSelected called", () => {
    wrapper.find(ItemSummary).at(0).simulate("mousedown");
    expect(onItemSelected).to.have.been.calledWith(items[0].id);
  });
});
