/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const ADD_ENTRY = Symbol("ADD_ENTRY");
export const DELETE_ENTRY = Symbol("DELETE_ENTRY");
export const SELECT_ENTRY = Symbol("SELECT_ENTRY");

let nextId = 0;

export function addEntry(name) {
  return {
    type: ADD_ENTRY,
    id: nextId++,
    name,
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
