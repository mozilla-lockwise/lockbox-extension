/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";

chai.use(chaiEnzyme());

import mountWithL10n from "test/mocks/l10n";
import App from "src/webextension/settings/components/app";
import FactoryReset from "src/webextension/settings/components/factory-reset";

describe("settings > <App/>", () => {
  it("render <App/>", () => {
    const wrapper = mountWithL10n(<App />);

    expect(wrapper).to.contain(<FactoryReset/>);
  });
});
