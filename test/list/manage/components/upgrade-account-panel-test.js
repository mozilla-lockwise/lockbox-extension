/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";

import mountWithL10n from "test/mocks/l10n";
import UpgradeAccountPanel from "src/webextension/list/manage/components/upgrade-account-panel";

chai.use(chaiEnzyme());

describe("list > manage > components > <UpgradeAccountPanel/>", () => {
  let spyCreateAccount, spySignIn;

  before(() => {
    spyCreateAccount = sinon.spy();
    spySignIn = sinon.spy();
  });

  afterEach(() => {
    spyCreateAccount.reset();
    spySignIn.reset();
  });

  it("render in guest mode", () => {
    const wrapper = mountWithL10n(
      <UpgradeAccountPanel mode="guest" doCreateAccount={spyCreateAccount} doSignIn={spySignIn}/>
    );

    expect(wrapper.find("h2")).to.have.text("uPGRADe");
    expect(wrapper.find("p")).to.have.text("uPGRADe yOUr lOCKBOx");
    expect(wrapper.findWhere((x) => x.prop("id") === "homepage-upgrade-action-create").find("button")).to.have.text("cREATe aCCOUNt");
    expect(wrapper.findWhere((x) => x.prop("id") === "homepage-upgrade-action-signin").find("button")).to.have.text("sIGn iN");
  });

  it("render empty in authenticated mode", () => {
    const wrapper = mountWithL10n(
      <UpgradeAccountPanel mode="authenticated" doCreateAccount={spyCreateAccount} doSignIn={spySignIn}/>
    );

    expect(wrapper.hostNodes()).to.have.length(0);
  });

  it('click on "Create Account"', () => {
    const wrapper = mountWithL10n(
      <UpgradeAccountPanel mode="guest" doCreateAccount={spyCreateAccount} doSignIn={spySignIn} />
    );

    wrapper.findWhere((x) => x.prop("id") === "homepage-upgrade-action-create")
           .find("button").simulate("click");
    expect(spyCreateAccount).to.have.been.calledWith();
  });

  it('click on "Sign In"', () => {
    const wrapper = mountWithL10n(
      <UpgradeAccountPanel mode="guest" doCreateAccount={spyCreateAccount} doSignIn={spySignIn} />
    );

    wrapper.findWhere((x) => x.prop("id") === "homepage-upgrade-action-signin")
      .find("button").simulate("click");
    expect(spySignIn).to.have.been.calledWith();
  });
});
