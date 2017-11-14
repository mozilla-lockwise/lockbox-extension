/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import * as telemetry from "../telemetry";

export const LOCAL_RESET_STARTING = Symbol("LOCAL_RESET_STARTING");
export const LOCAL_RESET_COMPLETED = Symbol("LOCAL_RESET_COMPLETED");

export const SHOW_MODAL = Symbol("SHOW_MODAL");
export const HIDE_MODAL = Symbol("HIDE_MODAL");

let nextActionId = 0;

// Reset actions

export function localReset() {
  return async(dispatch) => {
    const actionId = nextActionId++;
    dispatch(localResetStarting(actionId));
    await browser.runtime.sendMessage({
      type: "reset",
    });
    dispatch(localResetCompleted(actionId));
  };
}

function localResetStarting(actionId) {
  return {
    type: LOCAL_RESET_STARTING,
    actionId,
  };
}

function localResetCompleted(actionId) {
  telemetry.recordEvent("resetCompleted", "settings");
  return {
    type: LOCAL_RESET_COMPLETED,
    actionId,
  };
}

export function requestLocalReset() {
  telemetry.recordEvent("resetRequested", "settings");
  return showModal("local-reset");
}

// Modal actions

function showModal(id, props = {}) {
  return {
    type: SHOW_MODAL,
    id,
    props,
  };
}

export function hideModal() {
  return {
    type: HIDE_MODAL,
  };
}
