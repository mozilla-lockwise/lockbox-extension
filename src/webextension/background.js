/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import DataStore from "lockbox-datastore";

let ds = DataStore.create();

function openLockbox() {
  if (ds.opened) {
    // do something?
  }
  browser.tabs.create({url: browser.extension.getURL("manage/index.html")});
}

browser.browserAction.onClicked.addListener(openLockbox);

const fakeStore = {
  _nextId: 0,
  _datastore: [],

  add(details) {
    const entry = {...details, id: this._nextId++};
    this._datastore.push(entry);
    return entry;
  },

  update(entry) {
    for (let i = 0; i < this._datastore.length; i++) {
      if (this._datastore[i].id === entry.id) {
        this._datastore[i] = entry;
        break;
      }
    }
    return entry;
  },

  remove(id) {
    for (let i = 0; i < this._datastore.length; i++) {
      if (this._datastore[i].id === id) {
        this._datastore.splice(i, 1);
        break;
      }
    }
  },

  get(id) {
    for (let i = 0; i < this._datastore.length; i++) {
      if (this._datastore[i].id === id) {
        return this._datastore[i];
      }
    }
    return null;
  },
};

browser.runtime.onMessage.addListener((message, sender, respond) => {
  switch (message.type) {
  case "add_entry":
    respond({entry: fakeStore.add(message.entry)});
    break;
  case "update_entry":
    respond({entry: fakeStore.update(message.entry)});
    break;
  case "remove_entry":
    fakeStore.remove(message.id);
    respond({});
    break;
  case "get_entry":
    respond({entry: fakeStore.get(message.id)});
    break;
  }
});
