/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import openDataStore from "./datastore";
import initializeMessagePorts from "./message-ports";
import updateBrowserAction from "./browser-action";

openDataStore().then(async () => {
  initializeMessagePorts();
  await updateBrowserAction();

  // add this webextension's origin to saved logins' disabled hosts
  const extURL = new URL(browser.extension.getURL("/dummy"));
  const extHostname = extURL.origin;
  await browser.runtime.sendMessage({
    type: "bootstrap_logins_hostname_disable",
    hostname: extHostname,
  });
});
