/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { createStore } from "redux";

const PLUS_ONE = "PLUS_ONE";
const MINUS_ONE = "MINUS_ONE";

export function plusOne() {
  return {
    type: PLUS_ONE
  };
}

export function minusOne() {
  return {
    type: MINUS_ONE
  };
}

function reducer(state = {value: 0}, action) {
  switch (action.type) {
  case PLUS_ONE:
    return {value: state.value + 1};
  case MINUS_ONE:
    return {value: state.value - 1};
  default:
    return state;
  }
}

export const store = createStore(reducer);
