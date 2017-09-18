/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import mountWithL10n from "../../mock-l10n";
import Item from "../../../src/webextension/manage/components/item";
import ItemList from "../../../src/webextension/manage/components/item-list";

describe("<ItemList/>", () => {
  let onItemClick, wrapper;
  const items = [
    {id: "0", title: "title 0", username: "username 0"},
    {id: "1", title: "title 1", username: "username 1"},
    {id: "2", title: "title 2", username: "username 2"},
  ];

  beforeEach(() => {
    onItemClick = sinon.spy();
    wrapper = mountWithL10n(
      <ItemList items={items} selected={items[0].id}
                onItemClick={onItemClick}/>
    );
  });

  it("render all items", () => {
    expect(wrapper.find(Item)).to.have.length(3);
  });

  it("correct item is selected", () => {
    expect(wrapper.find(Item).at(0).prop("selected")).to.equal(true);
  });

  it("onItemClick called", () => {
    wrapper.find(Item).at(0).simulate("click");
    expect(onItemClick).to.have.been.calledWith(items[0].id);
  });
});
