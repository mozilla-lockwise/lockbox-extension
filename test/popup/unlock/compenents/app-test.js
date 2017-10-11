/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";
import React from "react";

import mountWithL10n from "test/mock-l10n";
import App from "src/webextension/popup/unlock/components/app";
import UnlockPrompt from
       "src/webextension/popup/unlock/components/unlock-prompt";

describe("popup > unlock > components > <App/>", () => {
  it("render app", () => {
    const wrapper = mountWithL10n(
      <App/>
    );

    expect(wrapper.find(UnlockPrompt)).to.have.length(1);
  });
});
