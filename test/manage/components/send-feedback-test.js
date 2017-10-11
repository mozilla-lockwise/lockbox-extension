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
import SendFeedback from
       "../../../src/webextension/manage/components/send-feedback";

describe("manage > components > <SendFeedback/>", () => {
  it("feedback link opened", () => {
    const windowOpen = sinon.stub(window, "open");
    const wrapper = mountWithL10n(
      <SendFeedback/>
    );
    wrapper.simulate("click");
    expect(windowOpen).to.have.callCount(1);
  });
});
