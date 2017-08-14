/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const ADD_ENTRY = Symbol("ADD_ENTRY");
export const UPDATE_ENTRY = Symbol("UPDATE_ENTRY");
export const REMOVE_ENTRY = Symbol("REMOVE_ENTRY");
export const START_NEW_ENTRY = Symbol("START_NEW_ENTRY");
export const CANCEL_NEW_ENTRY = Symbol("CANCEL_NEW_ENTRY");
export const SELECT_ENTRY = Symbol("SELECT_ENTRY");

let nextId = 0;

export function addEntry(details) {
  return {
    type: ADD_ENTRY,
    entry: {
      ...details,
      id: nextId++,
    },
  };
}

export function updateEntry(entry) {
  return {
    type: UPDATE_ENTRY,
    entry,
  };
}

export function removeEntry(id) {
  return {
    type: REMOVE_ENTRY,
    id,
  };
}

export function startNewEntry() {
  return {
    type: START_NEW_ENTRY,
  };
}

export function cancelNewEntry() {
  return {
    type: CANCEL_NEW_ENTRY,
  };
}

export function selectEntry(id) {
  return {
    type: SELECT_ENTRY,
    id,
  };
}
