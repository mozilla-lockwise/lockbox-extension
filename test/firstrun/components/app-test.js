/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

chai.use(chaiEnzyme());

import mountWithL10n from "../../mock-l10n";
import App from "../../../src/webextension/firstrun/components/app";
import Wizard from "../../../src/webextension/firstrun/components/wizard";
import Pages from "../../../src/webextension/firstrun/components/pages";

describe("firstrun <App/>", () => {
  it("render app", () => {
    const wrapper = mountWithL10n(
      <App/>
    );

    expect(wrapper.find(Wizard)).to.have.prop("pages", Pages);
  });
});
