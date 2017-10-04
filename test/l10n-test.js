/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import waitUntil from "async-wait-until";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { mount } from "enzyme";
import fetchMock from "fetch-mock";
import { Localized } from "fluent-react";
import React from "react";
import sinon from "sinon";

chai.use(chaiAsPromised);

import AppLocalizationProvider from "../src/webextension/l10n";

describe("<AppLocalizationProvider/>", () => {
  const locales = ["en-US", "es-ES"];
  const badLocales = ["en-GB", "de"];
  const bundle = "manage";
  function waitUntilTranslated() {
    return waitUntil(() => {
      return AppLocalizationProvider.prototype.render.callCount === 2;
    });
  }

  before(() => {
    fetchMock.get("/locales/en-US/manage.ftl", "hello = Hello\n");
    fetchMock.get("/locales/es-ES/manage.ftl", "hello = Hola\n");
    fetchMock.get("/locales/locales.json", JSON.stringify(locales));
    fetchMock.get("/bad-locales/locales.json", JSON.stringify(badLocales));
    fetchMock.get("*", {throws: new Error()});
  });

  after(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    sinon.spy(AppLocalizationProvider.prototype, "render");
  });

  afterEach(() => {
    AppLocalizationProvider.prototype.render.restore();
  });

  it("translate to en-US", async() => {
    const wrapper = mount(
      <AppLocalizationProvider bundle={bundle}
                               userLocales={["en-US"]}>
        <Localized id="hello">
          <div>untranslated</div>
        </Localized>
      </AppLocalizationProvider>
    );
    await waitUntilTranslated();
    expect(wrapper.text()).to.equal("Hello");
  });

  it("translate to es-ES", async() => {
    const wrapper = mount(
      <AppLocalizationProvider bundle={bundle}
                               userLocales={["es-ES"]}>
        <Localized id="hello">
          <div>untranslated</div>
        </Localized>
      </AppLocalizationProvider>
    );
    await waitUntilTranslated();
    expect(wrapper.text()).to.equal("Hola");
  });

  it("fallback to text content", async() => {
    const wrapper = mount(
      <AppLocalizationProvider bundle={bundle}
                               userLocales={locales}>
        <Localized id="nonexistent">
          <div>untranslated</div>
        </Localized>
      </AppLocalizationProvider>
    );
    await waitUntilTranslated();
    expect(wrapper.text()).to.equal("untranslated");
  });

  it("throws when locales.json is not found", () => {
    const provider = new AppLocalizationProvider({
      bundle: "manage", baseDir: "/nonexist",
    });
    return expect(provider.componentWillMount()).to.be.rejectedWith(
      Error, "unable to fetch available locales"
    );
  });

  it("throws when *.ftl is not found", () => {
    const provider = new AppLocalizationProvider({
      bundle: "manage", baseDir: "/bad-locales", userLocales: ["en-GB"],
    });
    return expect(provider.componentWillMount()).to.be.rejectedWith(
      Error, "unable to fetch localization for en-GB"
    );
  });
});
