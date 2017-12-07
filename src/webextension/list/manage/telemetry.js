/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as actions from "../actions";
import * as telemetry from "../../telemetry";

export default (store) => (next) => (action) => {
  switch (action.type) {
  case actions.ADD_ITEM_STARTING:
    telemetry.recordEvent("itemAdding", "manage");
    break;
  case actions.UPDATE_ITEM_STARTING:
    telemetry.recordEvent("itemUpdating", "manage");
    break;
  case actions.REMOVE_ITEM_STARTING:
    telemetry.recordEvent("itemDeleting", "manage");
    break;
  case actions.ADD_ITEM_COMPLETED:
    if (action.interactive) {
      telemetry.recordEvent("itemAdded", "manage", {itemid: action.item.id});
    }
    break;
  case actions.UPDATE_ITEM_COMPLETED:
    if (action.interactive) {
      telemetry.recordEvent("itemUpdated", "manage", {itemid: action.item.id});
    }
    break;
  case actions.REMOVE_ITEM_COMPLETED:
    if (action.interactive) {
      telemetry.recordEvent("itemDeleted", "manage", {itemid: action.item.id});
    }
    break;
  case actions.SELECT_ITEM_COMPLETED:
    telemetry.recordEvent("itemSelected", "manage", {itemid: action.item.id});
    break;
  case actions.COPIED_FIELD:
    telemetry.recordEvent(`${action.field}Copied`, "manage");
    break;
  case actions.START_NEW_ITEM:
    telemetry.recordEvent("addClick", "manage");
    break;
  case actions.SEND_FEEDBACK:
    telemetry.recordEvent("feedbackClick", "manage");
    break;
  }

  return next(action);
};
