/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import waitUntil from "async-wait-until";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiEnzyme);
chai.use(sinonChai);

import { simulateTyping } from "../../common";
import mountWithL10n from "../../mock-l10n";
import { WelcomePage1, VerifyPage2, FinishedPage3 } from
       "../../../src/webextension/firstrun/components/pages";

describe("firstrun > components > wizard pages", () => {
  const email = "eripley@wyutani.com";
  const password = "n0str0m0";
  let wrapper, next;

  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
  });

  describe("<WelcomePage1/>", () => {
    beforeEach(() => {
      sinon.spy(WelcomePage1.prototype, "render");
      next = sinon.spy();
      wrapper = mountWithL10n(
          <WelcomePage1 next={next}/>
      );
    });

    afterEach(() => {
      WelcomePage1.prototype.render.restore();
    });

    it("render page", () => {
      expect(wrapper.find("h1")).to.have.text("wELCOMe to lOCKBOx");
    });

    it("submit handled", async() => {
      browser.runtime.onMessage.addListener(() => ({email}));
      wrapper.find('button[type="submit"]').simulate("submit");
      await waitUntil(() => next.callCount > 0);
      expect(next).to.have.been.calledWith({email});
    });

    it("submit error handled", async() => {
      browser.runtime.onMessage.addListener(() => {
        throw new Error("failed");
      });
      wrapper.find('button[type="submit"]').simulate("submit");
      await waitUntil(() => WelcomePage1.prototype.render.callCount === 2);
      expect(wrapper.find(".error")).to.have.text(
        "Firefox Accounts login failed"
      );
    });
  });

  describe("<VerifyPage2/>", () => {
    beforeEach(() => {
      sinon.spy(VerifyPage2.prototype, "render");
      next = sinon.spy();
      wrapper = mountWithL10n(
        <VerifyPage2 email={email} next={next}/>
      );

      browser.runtime.onMessage.addListener((msg) => {
        if (msg.type !== "initialize" || msg.email !== email ||
            msg.password !== password) {
          throw new Error("bad request");
        }
      });
    });

    afterEach(() => {
      VerifyPage2.prototype.render.restore();
    });

    it("render page", () => {
      expect(wrapper.find("h1")).to.have.text("cONFIRm yOUr lOCKBOx pASSWORd");
    });

    it("submit handled", async() => {
      simulateTyping(wrapper.find("input"), password);
      wrapper.find('button[type="submit"]').simulate("submit");
      await waitUntil(() => next.callCount > 0);
      expect(next).to.have.been.calledWith({password});
    });

    it("submit error handled", async() => {
      simulateTyping(wrapper.find("input"), "jonesy");
      wrapper.find('button[type="submit"]').simulate("submit");
      await waitUntil(() => VerifyPage2.prototype.render.callCount === 3);
      expect(wrapper.find(".error")).to.have.text("wrong password");
    });
  });

  describe("<FinishedPage3/>", () => {
    beforeEach(() => {
      next = sinon.spy();
      wrapper = mountWithL10n(
        <FinishedPage3 next={next}/>
      );
      browser.runtime.onMessage.addListener((msg) => ({}));
    });

    it("render page", () => {
      expect(wrapper.find("h1")).to.have.text("dONe!");
    });

    it("submit handled", async() => {
      wrapper.find('button[type="submit"]').simulate("submit");
      await waitUntil(() => next.callCount > 0);
      expect(next).to.have.been.calledWith();
    });
  });
});
