/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import openDataStore from "./datastore";
import { openAccount, GUEST } from "./accounts";
import initializeMessagePorts from "./message-ports";
import updateBrowserAction from "./browser-action";

console.log("lockbox (background/index): initializing webextension");
openAccount(browser.storage.local).then(async (account) => {
  let datastore;

  try {
    let datastore = await openDataStore({ salt: account.uid });
    if (datastore.initialized && account.mode === GUEST) {
      await datastore.unlock();
    }
  } catch (err) {
    console.error(`lockbox (background/index): failed to open datastore (${err.message})`);
    throw err;
  }

  try {
    initializeMessagePorts();
    await updateBrowserAction({ account, datastore });
  } catch (err) {
    console.error(`lockbox (background/index"): failed to initialize ports and browser-action (${err.message})`);
  }
});
