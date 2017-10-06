/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";

import * as views from "../../src/webextension/background/views";

describe("views", () => {
  beforeEach(() => {
    browser.tabs.mockClearTabs();
  });

  describe("SingletonView", () => {
    let view;

    beforeEach(() => {
      view = new views.SingletonView("singleton.html");
    });

    it("open new tab", async() => {
      await view.open();
      expect(browser.tabs.mockAllTabs.map((i) => i.url)).to.deep.equal([
        "singleton.html",
      ]);
    });

    it("open second tab", async() => {
      await view.open();
      await view.open();
      expect(browser.tabs.mockAllTabs.map((i) => i.url)).to.deep.equal([
        "singleton.html",
      ]);
    });

    it("open tab (closed manually)", async() => {
      await view.open();
      browser.tabs.remove(view.id);
      await view.open();
      expect(browser.tabs.mockAllTabs.map((i) => i.url)).to.deep.equal([
        "singleton.html",
      ]);
    });

    it("close nonexistent tab", async() => {
      await view.close();
      expect(browser.tabs.mockAllTabs).to.deep.equal([]);
    });

    it("close existing tab", async() => {
      await view.open();
      await view.close();
      expect(browser.tabs.mockAllTabs).to.deep.equal([]);
    });

    it("close already-closed tab", async() => {
      await view.open();
      browser.tabs.remove(view.id);
      await view.close();
      expect(browser.tabs.mockAllTabs).to.deep.equal([]);
    });
  });

  describe("MultipleView", () => {
    let view;

    beforeEach(() => {
      view = new views.MultipleView("multiple.html");
    });

    it("open new tab", async() => {
      await view.open();
      expect(browser.tabs.mockAllTabs.map((i) => i.url)).to.deep.equal([
        "multiple.html",
      ]);
    });

    it("open second tab", async() => {
      await view.open();
      await view.open();
      expect(browser.tabs.mockAllTabs.map((i) => i.url)).to.deep.equal([
        "multiple.html", "multiple.html",
      ]);
    });

    it("close nonexistent tab", async() => {
      await view.close();
      expect(browser.tabs.mockAllTabs).to.deep.equal([]);
    });

    it("close existing tabs", async() => {
      await view.open();
      await view.open();
      await view.close();
      expect(browser.tabs.mockAllTabs).to.deep.equal([]);
    });

    it("close already-closed tab", async() => {
      await view.open();
      browser.tabs.remove([...view.views][0]);
      await view.close();
      expect(browser.tabs.mockAllTabs).to.deep.equal([]);
    });
  });

  describe("openView", () => {
    it("firstrun", async() => {
      await views.openView("firstrun");
      await views.openView("firstrun");
      expect(browser.tabs.mockAllTabs.map((i) => i.url)).to.deep.equal([
        "/firstrun/index.html",
      ]);
    });

    it("manage", async() => {
      await views.openView("manage");
      await views.openView("manage");
      expect(browser.tabs.mockAllTabs.map((i) => i.url)).to.deep.equal([
        "/manage/index.html", "/manage/index.html",
      ]);
    });
  });

  describe("closeView", () => {
    it("firstrun", async() => {
      await views.openView("firstrun");
      await views.closeView("firstrun");
      expect(browser.tabs.mockAllTabs).to.deep.equal([]);
    });

    it("manage", async() => {
      await views.openView("manage");
      await views.openView("manage");
      await views.closeView("manage");
      expect(browser.tabs.mockAllTabs).to.deep.equal([]);
    });
  });
});
