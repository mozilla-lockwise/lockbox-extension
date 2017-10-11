/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export class SingletonView {
  constructor(path) {
    this.path = path;
    this.id = undefined;
  }

  async open() {
    let windowId;
    if (this.id !== undefined) {
      // verify tab still exists
      try {
        let tabInfo = await browser.tabs.get(this.id);
        windowId = tabInfo.windowId;
      } catch (err) {
        // does not exist, forget existing info
        this.id = undefined;
      }
    }

    if (this.id !== undefined) {
      // focus owning window and activate tab
      await browser.windows.update(windowId, {
        focused: true,
      });
      await browser.tabs.update(this.id, {
        active: true,
      });
    } else {
      // create a tab in the current window
      let tabInfo = await browser.tabs.create({
        url: browser.extension.getURL(this.path),
      });
      this.id = tabInfo.id;
    }
    return this;
  }

  async close() {
    try {
      (this.id !== undefined) && await browser.tabs.remove(this.id);
    } catch (err) {
      // Q: loggit?
      console.log(`could not close ${this.path} view: ${err.message}`);
    }
    this.id = undefined;
    return this;
  }
}

export class MultipleView {
  constructor(path) {
    this.path = path;
    this.views = new Set();
  }

  async open() {
    // assume we always want to open a new one
    let tabInfo = await browser.tabs.create({
      url: browser.extension.getURL(this.path),
    });
    this.views.add(tabInfo.id);
    return this;
  }

  async close() {
    let pending = [...this.views.values()].map(async(tabId) => {
      try {
        tabId && browser.tabs.remove(tabId);
      } catch (err) {
        console.log(`could not close manage[${tabId}] view: ${err.message}`);
      }
    });
    await Promise.all(pending);
    this.views.clear();
  }
}

const views = {
  firstrun: new SingletonView("/firstrun/index.html"),
  manage: new SingletonView("/manage/index.html"),
};

export async function openView(name) {
  console.log(`opening view for ${name} ...`);
  const v = views[name];
  return v.open();
}

export async function closeView(name) {
  console.log(`closing view(s) for ${name} ...`);
  const v = views[name];
  return v.close();
}
