/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { combineReducers } from "redux";

import { ADD_ENTRY, UPDATE_ENTRY, REMOVE_ENTRY, START_NEW_ENTRY,
         CANCEL_NEW_ENTRY, SELECT_ENTRY } from "./actions";

function storageReducer(state = {entries: []}, action) {
  switch (action.type) {
  case ADD_ENTRY:
    return {...state, entries: [
      ...state.entries, action.entry
    ]};
  case UPDATE_ENTRY:
    return {...state, entries: state.entries.map((x) => {
      if (x.id === action.entry.id)
        return action.entry;
      return x;
    })};
  case REMOVE_ENTRY:
    return {...state, entries: state.entries.filter(
      (x) => x.id !== action.id
    )};
  default:
    return state;
  }
}

function uiReducer(state = {selectedEntry: null, newEntry: false}, action) {
  switch (action.type) {
  case START_NEW_ENTRY:
    return {...state, newEntry: true};
  case CANCEL_NEW_ENTRY:
    return {...state, newEntry: false};
  case SELECT_ENTRY:
    return {...state, selectedEntry: action.id};
  case ADD_ENTRY:
    return {...state, selectedEntry: action.entry.id, newEntry: false};
  case REMOVE_ENTRY:
    if (state.selectedEntry === action.id)
      return {...state, selectedEntry: null};
    return state;
  default:
    return state;
  }
}

export const reducer = combineReducers({
  storage: storageReducer,
  ui: uiReducer,
});
