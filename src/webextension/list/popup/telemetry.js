/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as actions from "../actions";
import * as telemetry from "../../telemetry";

export default (store) => (next) => (action) => {
  switch (action.type) {
  case actions.SELECT_ITEM_COMPLETED:
    telemetry.recordEvent("itemSelected", "doorhanger",
                          {itemid: action.item.id});
    break;
  case actions.COPIED_FIELD:
    telemetry.recordEvent(`${action.field}Copied`, "doorhanger");
    break;
  }
  return next(action);
};
