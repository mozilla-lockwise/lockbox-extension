/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import DataStore from "lockbox-datastore";

export const datastore = DataStore.create();

export const fakeStore = {
  _nextId: 0,
  _datastore: new Map(),

  unlock() {
    return Promise.resolve();
  },

  add(details) {
    const id = (this._nextId++).toString();
    const item = {...details, id};
    this._datastore.set(id, item);
    return Promise.resolve(item);
  },

  update(item) {
    if (!this._datastore.get(item.id))
      throw new Error("item does not exist");
    this._datastore.set(item.id, item);
    return Promise.resolve(item);
  },

  remove(id) {
    this._datastore.delete(id);
    return Promise.resolve();
  },

  get(id) {
    const item = this._datastore.get(id);
    if (item)
      return Promise.resolve(item);
    return Promise.reject();
  },

  list() {
    return Promise.resolve(this._datastore);
  },
};

