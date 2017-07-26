/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import DataStore from "lockbox-datastore";

let ds = DataStore.create();

function openLockbox() {
  if (ds.opened) {
    // do something?
  }
  browser.tabs.create({url: browser.extension.getURL("manage.html")});
}

browser.browserAction.onClicked.addListener(openLockbox);
