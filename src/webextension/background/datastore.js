/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import DataStore from "lockbox-datastore";

export const datastore = DataStore.create();

function makeEntrySummary(entry) {
  return {site: entry.site, id: entry.id};
}

export const fakeStore = {
  _nextId: 0,
  _datastore: [],

  add(details) {
    const entry = {...details, id: this._nextId++};
    this._datastore.push(entry);
    return Promise.resolve(entry);
  },

  update(entry) {
    for (let i = 0; i < this._datastore.length; i++) {
      if (this._datastore[i].id === entry.id) {
        this._datastore[i] = entry;
        break;
      }
    }
    return Promise.resolve(entry);
  },

  remove(id) {
    for (let i = 0; i < this._datastore.length; i++) {
      if (this._datastore[i].id === id) {
        this._datastore.splice(i, 1);
        break;
      }
    }
    return Promise.resolve();
  },

  get(id) {
    for (let i = 0; i < this._datastore.length; i++) {
      if (this._datastore[i].id === id) {
        return Promise.resolve(this._datastore[i]);
      }
    }
    return Promise.reject();
  },

  list() {
    return Promise.resolve(this._datastore.map(makeEntrySummary));
  },
};

