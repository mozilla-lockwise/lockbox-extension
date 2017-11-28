/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import openDataStore from "./datastore";
import { loadAccount } from "./accounts";
import initializeMessagePorts from "./message-ports";
import updateBrowserAction from "./browser-action";

// XXX: For now, initialize the datastore on startup and then hook up the
// button. Eventually, we'll have UX to create new datastores (and persist
// existing ones).
openDataStore().then(async (ds) => {
  try {
    // attempt to load authorization (FxA) data
    let acct = await loadAccount(browser.storage.local);
    // eslint-disable-next-line no-console
    console.log(`loaded authorization for '${acct.uid || ""}'`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`loading failed: ${err.message}`);
  }

  initializeMessagePorts();
  await updateBrowserAction(ds);
});
