/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { openView } from "./views";

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
  listener = () => { openView(name); };
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

  if (!ds.initialized) {
    // setup first-run popup
    console.log("setup first run click handler");
    return installListener("firstrun");
  } else if (ds.locked) {
    // setup unlock popup
    console.log("setup unlock popup");
    return installPopup("popup/unlock/index.html");
  }

  console.log("setup on click handler");
  return installListener("manage");
}
