/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import React from "react";
import ReactDOM from "react-dom";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import mountWithL10n from "../../mock-l10n";
import Item from "../../../src/webextension/manage/components/item";

describe("<Item/>", () => {
  let onClick;

  beforeEach(() => {
    onClick = sinon.spy();
  });

  it("onClick called", () => {
    const wrapper = mountWithL10n(
      <Item name="title" selected={true} onClick={onClick}/>
    );
    wrapper.simulate("click");
    expect(onClick).to.have.been.calledWith();
  });
});
