/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";

import mountWithL10n from "test/mocks/l10n";
import LinkAccount from "src/webextension/list/manage/components/link-account";

chai.use(chaiEnzyme());

describe("list > manage > components > <LinkAccount/>", () => {
  let spyOnCreate, spyOnSignin;

  before(() => {
    spyOnCreate = sinon.spy();
    spyOnSignin = sinon.spy();
  });

  afterEach(() => {
    spyOnCreate.resetHistory();
    spyOnSignin.resetHistory();
  });

  it("render in guest mode", () => {
    const wrapper = mountWithL10n(
      <LinkAccount onCreate={spyOnCreate} onSignin={spyOnSignin}/>
    );

    expect(wrapper.find("h2")).to.have.text("uPGRADe");
    expect(wrapper.find("p")).to.have.text("uPGRADe yOUr lOCKBOx");
    expect(wrapper.findWhere((x) => x.prop("id") === "homepage-linkaccount-action-create").find("button")).to.have.text("cREATe aCCOUNt");
    expect(wrapper.findWhere((x) => x.prop("id") === "homepage-linkaccount-action-signin").find("button")).to.have.text("sIGn iN");
  });

  it('click on "Create Account"', () => {
    const wrapper = mountWithL10n(
      <LinkAccount mode="guest" onCreate={spyOnCreate} onSignin={spyOnSignin} />
    );

    wrapper.findWhere((x) => x.prop("id") === "homepage-linkaccount-action-create")
           .find("button").simulate("click");
    expect(spyOnCreate).to.have.been.calledWith();
  });

  it('click on "Sign In"', () => {
    const wrapper = mountWithL10n(
      <LinkAccount mode="guest" onCreate={spyOnCreate} onSignin={spyOnSignin} />
    );

    wrapper.findWhere((x) => x.prop("id") === "homepage-linkaccount-action-signin")
      .find("button").simulate("click");
    expect(spyOnSignin).to.have.been.calledWith();
  });
});
