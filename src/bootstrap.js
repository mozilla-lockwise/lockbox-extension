/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-unused-vars */

const { utils: Cu } = Components;

Cu.import("resource://gre/modules/Services.jsm");

function startup({webExtension}, reason) {
  Services.telemetry.registerEvents("lockbox", {
    "startup": {
      methods: ["startup"],
      objects: ["addon", "webextension"],
    },
    "click": {
      methods: ["click"],
      objects: ["browser_action"],
      extra_keys: ["fxauid"],
    },
  });

  webExtension.startup().then(({browser}) => {
    console.log("embedded webextension has started");
    Services.telemetry.recordEvent("lockbox", "startup", "webextension");
    browser.runtime.onMessage.addListener((message, sender, respond) => {
      switch (message.type) {
      case "telemetry_event":
        Services.telemetry.recordEvent(
          message.category, message.method, message.object, null,
          message.extra || null
        );
        respond({});
      }
    });
  });
}

function shutdown(data, reason) {}
function install(data, reason) {}
function uninstall(data, reason) {}

// We need to reference these functions so that babel-plugin-rewire can see
// them for our tests.
startup;
shutdown;
install;
uninstall;
