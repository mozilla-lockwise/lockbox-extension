/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import mountWithL10n from "test/mocks/l10n";
import OpenFAQ from
       "src/webextension/list/manage/components/open-faq";

chai.use(sinonChai);

describe("list > manage > components > <OpenFAQ/>", () => {
  it("FAQ link opened", () => {
    const windowOpen = sinon.stub(window, "open");
    const wrapper = mountWithL10n(
      <OpenFAQ/>
    );
    wrapper.simulate("click");
    expect(windowOpen).to.have.callCount(1);
  });
});
