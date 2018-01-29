/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import * as sinon from "sinon";
import waitUntil from "async-wait-until";

import mountWithL10n from "test/mocks/l10n";
import StartUsing from "src/webextension/firstrun/components/using";

chai.use(chaiEnzyme());

describe("firstrun > components > <Using/>", () => {
  let wrapper, spyMessage;

  beforeEach(() => {
    wrapper = mountWithL10n(
      <StartUsing />
    );

    spyMessage = sinon.spy();
    browser.runtime.onMessage.addListener(spyMessage);
  });
  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
    spyMessage.resetHistory();
  });

  it("render <StartUsing/>", () => {
    expect(wrapper.find("h2").at(0)).to.have.text("gUESt");
    expect(wrapper.find("h2").at(1)).to.have.text("rETURNINg");
  });

  it("guest action started", async () => {
    wrapper.findWhere((x) => x.prop("id") === "firstrun-using-guest-action")
           .find("button").simulate("click");

    await waitUntil(() => spyMessage.callCount >= 1);
    expect(spyMessage).to.have.been.calledWith({
      type: "initialize",
      view: "manage",
    });
    expect(spyMessage).to.have.been.calledWith({
      type: "close_view",
      name: "firstrun",
    });
  });

  it("returning action started", async () => {
    wrapper.findWhere((x) => x.prop("id") === "firstrun-using-returning-action")
           .find("button").simulate("click");

    await waitUntil(() => spyMessage.callCount >= 1);
    expect(spyMessage).to.have.been.calledWith({
      type: "upgrade_account",
      view: "manage",
    });
    expect(spyMessage).to.have.been.calledWith({
      type: "close_view",
      name: "firstrun",
    });
  });
});
