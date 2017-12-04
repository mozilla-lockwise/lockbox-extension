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
  let wrapper, spyRedirect, spyMessage;

  beforeEach(() => {
    spyRedirect = sinon.spy();
    wrapper = mountWithL10n(
      <StartUsing redirect={spyRedirect}/>
    );

    spyMessage = sinon.spy();
    browser.runtime.onMessage.addListener(spyMessage);
  });
  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
    spyMessage.reset();
    spyRedirect.reset();
  });

  it("render <StartUsing/>", () => {
    expect(wrapper.find("h1")).to.have.text("sTARt uSINg lOCKBOx");
    expect(wrapper.find("p").at(0)).to.have.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.");
    expect(wrapper.find("h2").at(0)).to.have.text("gUESt");
    expect(wrapper.find("h2").at(1)).to.have.text("rETURNINg");
  });

  it("guest action started", async () => {
    wrapper.find("button#firstrun-using-guest-action").simulate("click");

    await waitUntil(() => spyRedirect.callCount === 1);
    expect(spyMessage).to.have.been.calledWith({
      type: "initialize",
    });
    expect(spyRedirect).to.have.been.calledWith(browser.extension.getURL("/list/manage/index.html"));
  });

  it("returning action started", async () => {
    wrapper.find("button#firstrun-using-returning-action").simulate("click");

    await waitUntil(() => spyRedirect.callCount === 1);
    expect(spyMessage).to.have.been.calledWith({
      type: "upgrade",
    });
    expect(spyRedirect).to.have.been.calledWith(browser.extension.getURL("/list/manage/index.html"));
  });
});
