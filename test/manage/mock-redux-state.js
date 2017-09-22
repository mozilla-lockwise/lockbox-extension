/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Keep these in sync with <src/webextension/manage/reducers.js>.

export const initialState = {
  cache: {
    items: [],
    currentItem: null,
    pendingAdd: null,
  },
  ui: {
    newItem: false,
    filter: [],
  },
};

export const filledState = {
  cache: {
    items: [
      {id: "0", title: "title 0", username: "username 0",
       origins: ["origin-0.com"]},
      {id: "1", title: "title 1", username: "username 1",
       origins: ["origin-1.com"]},
      {id: "2", title: "title 2", username: "username 2",
       origins: ["origin-2.com"]},
    ],
    currentItem: {
      id: "1",
      origins: ["origin-1.com"],
      title: "title 1",
      entry: {
        kind: "login",
        username: "username 1",
        password: "password 1",
        notes: "notes 1",
      },
    },
    pendingAdd: null,
  },
  ui: {
    newItem: false,
    filter: [],
  },
};
