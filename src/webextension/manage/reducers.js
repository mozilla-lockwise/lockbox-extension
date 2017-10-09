/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { combineReducers } from "redux";

import {
  LIST_ITEMS_COMPLETED, ADD_ITEM_STARTING, ADD_ITEM_COMPLETED,
  UPDATE_ITEM_COMPLETED, REMOVE_ITEM_COMPLETED, SELECT_ITEM_STARTING,
  SELECT_ITEM_COMPLETED, START_NEW_ITEM, EDIT_CURRENT_ITEM, CANCEL_EDITING,
  FILTER_ITEMS, SHOW_MODAL, HIDE_MODAL,
} from "./actions";
import { makeItemSummary } from "../common";
import { NEW_ITEM_ID } from "./common";

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
  case START_NEW_ITEM:
    return {...state, currentItem: null};
  default:
    return state;
  }
}

export function uiReducer(state = {
  editing: false, selectedItemId: null, filter: "",
}, action) {
  switch (action.type) {
  case ADD_ITEM_COMPLETED:
    return {...state, editing: false, selectedItemId: action.item.id};
  case UPDATE_ITEM_COMPLETED:
    return {...state, editing: false};
  case SELECT_ITEM_STARTING:
    return {...state, editing: false, selectedItemId: action.id};
  case START_NEW_ITEM:
    return {...state, editing: true, selectedItemId: NEW_ITEM_ID};
  case EDIT_CURRENT_ITEM:
    return {...state, editing: true};
  case CANCEL_EDITING:
    if (state.selectedItemId === NEW_ITEM_ID) {
      return {...state, editing: false, selectedItemId: null};
    }
    return {...state, editing: false};
  case FILTER_ITEMS:
    return {...state, filter: action.filter};
  default:
    return state;
  }
}

export function modalReducer(state = {id: null, props: null}, action) {
  switch (action.type) {
  case SHOW_MODAL:
    return {id: action.id, props: action.props};
  case HIDE_MODAL:
    return {id: null, props: null};
  default:
    return state;
  }
}

const reducer = combineReducers({
  cache: cacheReducer,
  ui: uiReducer,
  modal: modalReducer,
});

export default reducer;
