/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { openView } from "./views";
import * as telemetry from "./telemetry";

let listener;
let popup;

function installPopup(path) {
  popup = browser.extension.getURL(path);
  browser.browserAction.setPopup({
    popup,
  });
}

function uninstallPopup() {
  if (popup) {
    browser.browserAction.setPopup({ popup: "" });
  }
  popup = null;
}

function installListener(name) {
  listener = () => {
    telemetry.recordEvent("iconClick", "toolbar");
    openView(name);
  };
  browser.browserAction.onClicked.addListener(listener);
}

function uninstallListener() {
  if (listener) {
    browser.browserAction.onClicked.removeListener(listener);
  }
  listener = null;
}

export default async function updateBrowserAction(ds) {
  // clear listener
  // XXXX: be more efficient with this?
  uninstallListener();
  uninstallPopup();

  const iconpath = ds.locked ? "icons/lb_locked.svg" : "icons/lb_unlocked.svg";
  browser.browserAction.setIcon({ path: iconpath });

  if (!ds.initialized) {
    // setup first-run popup
    return installListener("firstrun");
  } else if (ds.locked) {
    // setup unlock popup
    return installPopup("popup/unlock/index.html");
  }

  // XXX: Add a pref to disable this before landing!
  return installPopup("list/popup/index.html");
}
