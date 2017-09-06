/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import waitUntil from "async-wait-until";
import { expect } from "chai";
import { mount } from "enzyme";
import fetchMock from "fetch-mock";
import { Localized } from "fluent-react";
import React from "react";
import sinon from "sinon";

import AppLocalizationProvider from "../src/webextension/l10n";

describe("<AppLocalizationProvider/>", () => {
  const locales = ["en-US", "es-ES"];
  function waitUntilTranslated() {
    return waitUntil(() => {
      return AppLocalizationProvider.prototype.render.callCount === 2;
    });
  }

  before(() => {
    fetchMock.get("./en-US.ftl", "hello = Hello\n");
    fetchMock.get("./es-ES.ftl", "hello = Hola\n");
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
      <AppLocalizationProvider availableLocales={locales}
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
      <AppLocalizationProvider availableLocales={locales}
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
      <AppLocalizationProvider availableLocales={locales}
                               userLocales={locales}>
        <Localized id="nonexistent">
          <div>untranslated</div>
        </Localized>
      </AppLocalizationProvider>
    );
    await waitUntilTranslated();
    expect(wrapper.text()).to.equal("untranslated");
  });
});
