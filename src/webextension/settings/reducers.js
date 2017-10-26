/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// keep in sync with <test/settings/mock-redux-state.js>

import { combineReducers } from "redux";

import {
  SHOW_MODAL, HIDE_MODAL,
} from "./actions";

export function modalReducer(state = {id: null, props: null}, action) {
  switch (action.type) {
  case SHOW_MODAL:
    return {...state, id: action.id, props: action.props};
  case HIDE_MODAL:
    return {...state, id: null, props: null};
  default:
    return state;
  }
}

const reducer = combineReducers({
  modal: modalReducer,
});

export default reducer;
