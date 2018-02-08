/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import mountWithL10n from "test/mocks/l10n";
import AccountSummary, { AccountSummaryButton, AccountSummaryDropdown } from
       "src/webextension/list/manage/components/account-summary";

chai.use(chaiEnzyme());
chai.use(sinonChai);

const avatar = "https://avatar.example/c49fd653afb7010bd47d5ef81a95d3977803517d.png";

describe("list > manage > components > <AccountSummaryButton/>", () => {
  it("render user", () => {
    const wrapper = mountWithL10n(
      <AccountSummaryButton displayName="Ellen Ripley" avatar={avatar}/>
    );

    expect(wrapper.find("span").at(1)).to.have.text("Ellen Ripley");
    expect(wrapper.find("img")).to.have.prop("src").to.equal(avatar);
  });

  it("render nothing", () => {
    const wrapper = mountWithL10n(<AccountSummaryButton/>);

    expect(wrapper.hostNodes()).to.have.length(0);
  });
});

describe("list > manage > components > <AccountSummaryDropdown/>", () => {
  it("render dropdown", () => {
    const wrapper = mountWithL10n(
      <AccountSummaryDropdown isOpen={true} onClose={() => {}}
                              onClickAccount={() => {}}
                              onClickOptions={() => {}}
                              onClickSignout={() => {}}/>
    );
    expect(wrapper).to.have.descendants("ul");
  });

  it("render nothing", () => {
    const wrapper = mountWithL10n(
      <AccountSummaryDropdown isOpen={false} onClose={() => {}}
                              onClickAccount={() => {}}
                              onClickOptions={() => {}}
                              onClickSignout={() => {}}/>
    );
    expect(wrapper).not.to.have.descendants("ul");
  });

  it("handle account click", () => {
    const onClickAccount = sinon.spy();
    const onClose = sinon.spy();
    const wrapper = mountWithL10n(
      <AccountSummaryDropdown isOpen={true} onClose={onClose}
                              onClickAccount={onClickAccount}
                              onClickOptions={() => {}}
                              onClickSignout={() => {}}/>
    );
    wrapper.findWhere((x) => x.prop("id") === "account-summary-account")
           .find("button").simulate("click");

    expect(onClickAccount).to.have.callCount(1);
    expect(onClose).to.have.callCount(1);
  });

  it("handle options click", () => {
    const onClickOptions = sinon.spy();
    const onClose = sinon.spy();
    const wrapper = mountWithL10n(
      <AccountSummaryDropdown isOpen={true} onClose={onClose}
                              onClickAccount={() => {}}
                              onClickOptions={onClickOptions}
                              onClickSignout={() => {}}/>
    );
    wrapper.findWhere((x) => x.prop("id") === "account-summary-options")
           .find("button").simulate("click");

    expect(onClickOptions).to.have.callCount(1);
    expect(onClose).to.have.callCount(1);
  });

  it("handle signout click", () => {
    const onClickSignout = sinon.spy();
    const onClose = sinon.spy();
    const wrapper = mountWithL10n(
      <AccountSummaryDropdown isOpen={true} onClose={onClose}
                              onClickAccount={() => {}}
                              onClickOptions={() => {}}
                              onClickSignout={onClickSignout}/>
    );
    wrapper.findWhere((x) => x.prop("id") === "account-summary-signout")
           .find("button").simulate("click");

    expect(onClickSignout).to.have.callCount(1);
    expect(onClose).to.have.callCount(1);
  });
});

describe("list > manage > components > <AccountSummary/>", () => {
  it("render button", () => {
    const wrapper = mountWithL10n(
      <AccountSummary displayName="Ellen Ripley" avatar={avatar}
                      onClickAccount={() => {}} onClickOptions={() => {}}
                      onClickSignout={() => {}}/>
    );

    expect(wrapper.find("span").at(1)).to.have.text("Ellen Ripley");
    expect(wrapper.find("img")).to.have.prop("src").to.equal(avatar);
    expect(wrapper).not.to.have.descendants("ul");
  });

  it("render nothing", () => {
    const wrapper = mountWithL10n(
      <AccountSummary onClickAccount={() => {}} onClickOptions={() => {}}
                      onClickSignout={() => {}}/>
    );

    expect(wrapper.hostNodes()).to.have.length(0);
  });

  it("open/close dropdown", () => {
    const wrapper = mountWithL10n(
      <AccountSummary displayName="Ellen Ripley" avatar={avatar}
                      onClickAccount={() => {}} onClickOptions={() => {}}
                      onClickSignout={() => {}}/>
    );

    wrapper.find("img").simulate("click");
    expect(wrapper).to.have.descendants("ul");

    wrapper.find("ul button").at(0).simulate("click");
    expect(wrapper).not.to.have.descendants("ul");
  });
});
