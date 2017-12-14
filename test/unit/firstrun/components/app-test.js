/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

import mountWithL10n from "test/mocks/l10n";
import App from "src/webextension/firstrun/components/app";
import Intro from "src/webextension/firstrun/components/intro";
import Using from "src/webextension/firstrun/components/using";

chai.use(chaiEnzyme());

describe("firstrun > components > <App/>", () => {
  it("render app", () => {
    const wrapper = mountWithL10n(
      <App/>
    );

    expect(wrapper).to.contain(Intro);
    expect(wrapper).to.contain(Using);
  });
});
