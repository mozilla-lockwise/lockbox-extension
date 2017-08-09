/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { combineReducers } from "redux";

import { ADD_ENTRY, DELETE_ENTRY, SELECT_ENTRY } from "./actions";

function storageReducer(state = {entries: []}, action) {
  switch (action.type) {
  case ADD_ENTRY:
    return Object.assign({}, state, {entries: [
      ...state.entries,
      {id: action.id, name: action.name}
    ]});
  case DELETE_ENTRY:
    return Object.assign({}, state, {entries: state.entries.filter(
      (x) => x.id !== action.id
    )});
  default:
    return state;
  }
}

function uiReducer(state = {selectedEntry: null}, action) {
  switch (action.type) {
  case ADD_ENTRY:
  case SELECT_ENTRY:
    return Object.assign({}, state, {selectedEntry: action.id});
  case DELETE_ENTRY:
    if (state.selectedEntry === action.id)
      return Object.assign({}, state, {selectedEntry: null});
    return state;
  default:
    return state;
  }
}

export const reducer = combineReducers({
  storage: storageReducer,
  ui: uiReducer,
});
