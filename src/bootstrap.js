/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-unused-vars */

const { utils: Cu } = Components;

Cu.import("resource://gre/modules/Services.jsm");

// In order to allow us to register new telemetry events in the middle of a
// Firefox session, we currently need to ensure that our events have a unique
// category name. In order to do this, every time we update the events in any
// way, we must also give them a unique category name. If you're updating the
// events, please increment the version number here by 1.
const TELEMETRY_CATEGORY = "lockboxv0";

function startup({webExtension}, reason) {
  try {
    Services.telemetry.registerEvents(TELEMETRY_CATEGORY, {
      "startup": {
        methods: ["startup"],
        objects: ["addon", "webextension"],
      },
      "iconClick": {
        methods: ["iconClick"],
        objects: ["toolbar"],
        extra_keys: ["fxauid"],
      },
      "displayView": {
        methods: ["render"],
        objects: ["firstrun", "manage", "popupUnlock"],
        extra_keys: ["fxauid"],
      },
      "fxaSignIn": {
        methods: ["render"],
        objects: ["signInPage"],
      },
      "confirmPW": {
        methods: ["click"],
        objects: ["confirmPWPage"],
      },
      "setupDone": {
        methods: ["click"],
        objects: ["setupDoneButton"],
        extra_keys: ["fxauid"],
      },
      "itemAdding": {
        methods: ["itemAdding"],
        objects: ["addItemForm"],
        extra_keys: ["fxauid"],
      },
      "itemUpdating": {
        methods: ["itemUpdating"],
        objects: ["updatingItemForm"],
        extra_keys: ["fxauid"],
      },
      "itemDeleting": {
        methods: ["itemDeleting"],
        objects: ["updatingItemForm"],
        extra_keys: ["fxauid"],
      },
      "itemSelected": {
        methods: ["itemSelected"],
        objects: ["itemList"],
        extra_keys: ["fxauid"],
      },
      "addClick": {
        methods: ["addClick"],
        objects: ["addButton"],
        extra_keys: ["fxauid"],
      },
      "itemAdded": {
        methods: ["itemAdded"],
        objects: ["addItemForm"],
        extra_keys: ["itemid", "fxauid"],
      },
      "datastore": {
        methods: ["added", "updated", "deleted"],
        objects: ["datastore"],
        extra_keys: ["itemid", "fxauid", "fields"],
      },
      "feedback": {
        methods: ["feedbackClick"],
        objects: ["manage"],
        extra_keys: ["fxauid"],
      },
    });
  } catch (e) {
    if (e.message === "Attempt to register event that is already registered.") {
      // eslint-disable-next-line no-console
      console.log("telemetry events already registered; skipping registration");
    } else {
      throw e;
    }
  }

  webExtension.startup().then(({browser}) => {
    console.log("embedded webextension has started");
    Services.telemetry.recordEvent(TELEMETRY_CATEGORY, "startup",
                                   "webextension");
    browser.runtime.onMessage.addListener((message, sender, respond) => {
      switch (message.type) {
      case "telemetry_event":
        Services.telemetry.recordEvent(
          TELEMETRY_CATEGORY, message.method, message.object, null,
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
