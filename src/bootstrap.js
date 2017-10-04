/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-unused-vars */

Components.utils.import("resource://gre/modules/Services.jsm");

function startup({webExtension}, reason) {
  Services.telemetry.registerEvents("lockbox", {
    "startup": {
      methods: ["startup"],
      objects: ["addon", "webextension"],
    },
    "click": {
      methods: ["click"],
      objects: ["browser_action"],
    },
  });
  webExtension.startup().then(() => {
    Services.telemetry.recordEvent("lockbox", "startup", "webextension", null, null);
    console.log("embedded webextension has started");
  });
}

function shutdown(data, reason) {}
function install(data, reason) {}
function uninstall(data, reason) {}
