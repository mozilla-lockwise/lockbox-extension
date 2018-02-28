/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { openView } from "./views";
import getAccount, * as accounts from "./accounts";
import { DEFAULT_APP_KEY } from "./datastore";
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

function installEntriesAction() {
  return installPopup("list/popup/index.html");
}

export default async function updateBrowserAction({account = getAccount(), datastore}) {
  // clear listener
  // XXXX: be more efficient with this?
  uninstallListener();
  uninstallPopup();

  const iconpath = datastore.locked ? "icons/lb_locked.svg" : "icons/lb_unlocked.svg";
  browser.browserAction.setIcon({ path: iconpath });

  if (!datastore.initialized) {
    // setup first-run popup
    return installListener("firstrun");
  }
  if (datastore.locked) {
    if (account.mode === accounts.GUEST) {
      // unlock on user's behalf ...
      // XXXX: is this a bad idea or terrible idea?
      try {
        await datastore.unlock(DEFAULT_APP_KEY);
        return installEntriesAction();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`WARNING: datastore is in an inconsistent state.  You may need to reset and start again`);
      }
    }
    // setup unlock popup
    return installPopup("unlock/index.html");
  }

  return installEntriesAction();
}
