/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { combineReducers } from "redux";

import {
  LIST_ITEMS_COMPLETED, ADD_ITEM_STARTING, ADD_ITEM_COMPLETED,
  UPDATE_ITEM_COMPLETED, REMOVE_ITEM_COMPLETED, SELECT_ITEM_STARTING,
  SELECT_ITEM_COMPLETED, START_NEW_ITEM, CANCEL_NEW_ITEM, FILTER_ITEMS,
} from "./actions";
import { makeItemSummary } from "../common";
import { defaultFilter } from "./filter";

function maybeAddCurrentItem(state, action) {
  if (state.pendingAdd === action.actionId) {
    return {currentItem: action.item, pendingAdd: null};
  }
  return {};
}

function maybeUpdateCurrentItem(state, action) {
  if (state.currentItem && state.currentItem.id === action.item.id) {
    return {currentItem: action.item};
  }
  return {};
}

function maybeRemoveCurrentItem(state, action) {
  if (state.currentItem && state.currentItem.id === action.id) {
    return {currentItem: null};
  }
  return {};
}

export function cacheReducer(state = {
  items: [], currentItem: null, pendingAdd: null,
}, action) {
  switch (action.type) {
  case LIST_ITEMS_COMPLETED:
    return {
      ...state,
      items: action.items,
    };
  case ADD_ITEM_STARTING:
    return {
      ...state,
      pendingAdd: action.actionId,
    };
  case ADD_ITEM_COMPLETED:
    return {
      ...state,
      items: [...state.items, makeItemSummary(action.item)],
      ...maybeAddCurrentItem(state, action),
    };
  case UPDATE_ITEM_COMPLETED:
    return {
      ...state,
      items: state.items.map((x) => {
        if (x.id === action.item.id) {
          return makeItemSummary(action.item);
        }
        return x;
      }),
      ...maybeUpdateCurrentItem(state, action),
    };
  case REMOVE_ITEM_COMPLETED:
    return {
      ...state,
      items: state.items.filter((x) => x.id !== action.id),
      ...maybeRemoveCurrentItem(state, action),
    };
  case SELECT_ITEM_COMPLETED:
    return {...state, currentItem: action.item};
  default:
    return state;
  }
}

export function uiReducer(state = {
  newItem: false, selectedItemId: null, filter: defaultFilter,
}, action) {
  switch (action.type) {
  case START_NEW_ITEM:
    return {...state, newItem: true};
  case CANCEL_NEW_ITEM:
    return {...state, newItem: false};
  case ADD_ITEM_COMPLETED:
    return {...state, newItem: false, selectedItemId: action.item.id};
  case SELECT_ITEM_STARTING:
    return {...state, selectedItemId: action.id};
  case FILTER_ITEMS:
    return {...state, filter: action.filter};
  default:
    return state;
  }
}

const reducer = combineReducers({
  cache: cacheReducer,
  ui: uiReducer,
});

export default reducer;
