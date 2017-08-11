/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const ADD_ENTRY = Symbol("ADD_ENTRY");
export const UPDATE_ENTRY = Symbol("UPDATE_ENTRY");
export const DELETE_ENTRY = Symbol("DELETE_ENTRY");
export const SELECT_ENTRY = Symbol("SELECT_ENTRY");

let nextId = 0;

export function addEntry() {
  return {
    type: ADD_ENTRY,
    id: nextId++,
    details: {
      site: "(default)",
      username: "(default)",
      password: "(default)",
    }
  };
}

export function updateEntry(id, details) {
  return {
    type: UPDATE_ENTRY,
    id,
    details,
  };
}

export function deleteEntry(id) {
  return {
    type: DELETE_ENTRY,
    id,
  };
}

export function selectEntry(id) {
  return {
    type: SELECT_ENTRY,
    id,
  };
}
