/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ADD_ENTRY } from "./actions";

export function reducer(state = {entries: []}, action) {
  switch (action.type) {
  case ADD_ENTRY:
    return Object.assign({}, state, {entries: [
      ...state.entries,
      {id: action.id, name: action.name}
    ]});
  default:
    return state;
  }
}
