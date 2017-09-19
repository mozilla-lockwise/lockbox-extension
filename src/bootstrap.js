/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-unused-vars */

function startup({webExtension}, reason) {
  webExtension.startup().then(() => {
    console.log("embedded webextension has started");
  });
}

function shutdown(data, reason) {}
function install(data, reason) {}
function uninstall(data, reason) {}
