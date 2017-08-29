/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { combineReducers } from "redux";

import {
  LIST_ENTRIES_COMPLETED, ADD_ENTRY_STARTING, ADD_ENTRY_COMPLETED,
  UPDATE_ENTRY_COMPLETED, REMOVE_ENTRY_COMPLETED, SELECT_ENTRY_COMPLETED,
  START_NEW_ENTRY, CANCEL_NEW_ENTRY
} from "./actions";

function makeEntrySummary(entry) {
  return {title: entry.title, id: entry.id};
}

function maybeAddCurrentEntry(state, action) {
  if (state.pendingAdd === action.actionId) {
    return {currentEntry: action.entry, pendingAdd: null};
  }
  return {};
}

function maybeUpdateCurrentEntry(state, action) {
  if (state.currentEntry && state.currentEntry.id === action.entry.id) {
    return {currentEntry: action.entry};
  }
  return {};
}

function maybeRemoveCurrentEntry(state, action) {
  if (state.currentEntry && state.currentEntry.id === action.id) {
    return {currentEntry: null};
  }
  return {};
}

function cacheReducer(state = {
  entries: [], currentEntry: null, pendingAdd: null
}, action) {
  switch (action.type) {
  case LIST_ENTRIES_COMPLETED:
    return {
      ...state,
      entries: action.entries,
    };
  case ADD_ENTRY_STARTING:
    return {
      ...state,
      pendingAdd: action.actionId,
    };
  case ADD_ENTRY_COMPLETED:
    return {
      ...state,
      entries: [...state.entries, makeEntrySummary(action.entry)],
      ...maybeAddCurrentEntry(state, action),
    };
  case UPDATE_ENTRY_COMPLETED:
    return {
      ...state,
      entries: state.entries.map((x) => {
        if (x.id === action.entry.id) {
          return makeEntrySummary(action.entry);
        }
        return x;
      }),
      ...maybeUpdateCurrentEntry(state, action),
    };
  case REMOVE_ENTRY_COMPLETED:
    return {
      ...state,
      entries: state.entries.filter((x) => x.id !== action.id),
      ...maybeRemoveCurrentEntry(state, action),
    };
  case SELECT_ENTRY_COMPLETED:
    return {...state, currentEntry: action.entry};
  default:
    return state;
  }
}

function uiReducer(state = {newEntry: false}, action) {
  switch (action.type) {
  case START_NEW_ENTRY:
    return {...state, newEntry: true};
  case CANCEL_NEW_ENTRY:
    return {...state, newEntry: false};
  case ADD_ENTRY_COMPLETED:
    return {...state, newEntry: false};
  default:
    return state;
  }
}

export const reducer = combineReducers({
  cache: cacheReducer,
  ui: uiReducer,
});
