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
  let wrapper, spy;

  beforeEach(() => {
    wrapper = mountWithL10n(
      <StartUsing />
    );
    spy = sinon.spy();
    browser.runtime.onMessage.addListener(spy);
  });
  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
    spy.reset();
  });

  it("render <StartUsing/>", () => {
    expect(wrapper.find("h1")).to.have.text("sTARt uSINg lOCKBOx");
    expect(wrapper.find("p").at(0)).to.have.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam.");
    expect(wrapper.find("h2").at(0)).to.have.text("gUESt");
    expect(wrapper.find("h2").at(1)).to.have.text("rETURNINg");
  });

  it("guest action started", async () => {
    wrapper.find("button#firstrun-using-guest-action").simulate("click");

    await waitUntil(() => spy.callCount === 2);
    expect(spy.getCall(0)).to.have.been.calledWith({
      type: "initialize",
    });
    expect(spy.getCall(1)).to.have.been.calledWith({
      type: "close_view",
      name: "firstrun",
    });
  });

  it("returning action started", async () => {
    wrapper.find("button#firstrun-using-returning-action").simulate("click");

    await waitUntil(() => spy.callCount === 2);
    expect(spy.getCall(0)).to.have.been.calledWith({
      type: "upgrade",
    });
    expect(spy.getCall(1)).to.have.been.calledWith({
      type: "close_view",
      name: "firstrun",
    });
  });
});
