/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {utils: Cu} = Components;

let aboutFactory;

function startup({webExtension}, reason) {
  Cu.import("resource://lockbox/aboutPage.jsm");
  aboutFactory = new ComponentFactory(AboutModule);

  webExtension.startup().then(() => {
    console.log("embedded webextension has started");
  });
}

function shutdown(data, reason) {
  if (reason == APP_SHUTDOWN) {
    return;
  }

  aboutFactory.unregister();
}

function install(data, reason) {}
function uninstall(data, reason) {}
