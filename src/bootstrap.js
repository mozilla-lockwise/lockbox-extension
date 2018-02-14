/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global ADDON_INSTALL, ADDON_UPGRADE, ADDON_UNINSTALL */
/* eslint-disable no-unused-vars */

const { utils: Cu } = Components;

Cu.import("resource://gre/modules/Services.jsm");

const REMEMBER_SIGNONS_PREF = "signon.rememberSignons";
const ORIGINAL_REMEMBER_SIGNONS_PREF =
      "extensions.lockbox.originalRememberSignons";

// In order to allow us to register new telemetry events in the middle of a
// Firefox session, we currently need to ensure that our events have a unique
// category name. In order to do this, every time we update the events in any
// way, we must also give them a unique category name. If you're updating the
// events, please increment the version number here by 1.
const TELEMETRY_CATEGORY = "lockboxv1";

class EventDispatcher {
  constructor() {
    this.pendingEvents = [];
  }

  record(event) {
    if (this.port) {
      this.port.postMessage(event);
      return true;
    }

    this.pendingEvents.push(event);
    return false;
  }

  connect(port) {
    this.port = port;

    const events = this.pendingEvents;
    this.pendingEvents = [];
    for (let evt of events) {
      this.port.postMessage(evt);
    }
  }
}

const dispatcher = new EventDispatcher();
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
        objects: ["firstrun", "popupUnlock", "manage", "doorhanger"],
        extra_keys: ["fxauid"],
      },
      "itemAdding": {
        methods: ["itemAdding"],
        objects: ["manage"],
        extra_keys: ["fxauid"],
      },
      "itemUpdating": {
        methods: ["itemUpdating"],
        objects: ["manage"],
        extra_keys: ["fxauid"],
      },
      "itemDeleting": {
        methods: ["itemDeleting"],
        objects: ["manage"],
        extra_keys: ["fxauid"],
      },
      "itemAdded": {
        methods: ["itemAdded"],
        objects: ["manage"],
        extra_keys: ["itemid", "fxauid"],
      },
      "itemUpdated": {
        methods: ["itemUpdated"],
        objects: ["manage"],
        extra_keys: ["itemid", "fxauid"],
      },
      "itemDeleted": {
        methods: ["itemDeleted"],
        objects: ["manage"],
        extra_keys: ["itemid", "fxauid"],
      },
      "itemSelected": {
        methods: ["itemSelected"],
        objects: ["manage", "doorhanger"],
        extra_keys: ["fxauid"],
      },
      "addClick": {
        methods: ["addClick"],
        objects: ["manage"],
        extra_keys: ["fxauid"],
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
      "faq": {
        methods: ["faqClick"],
        objects: ["manage"],
        extra_keys: ["fxauid"],
      },
      "itemCopied": {
        methods: ["usernameCopied", "passwordCopied"],
        objects: ["manage", "doorhanger"],
        extra_keys: ["fxauid"],
      },
      "resetRequested": {
        methods: ["resetRequested"],
        objects: ["settings"],
        extra_keys: ["fxauid"],
      },
      "resetCompleted": {
        methods: ["resetCompleted"],
        objects: ["settings"],
        extra_keys: ["fxauid"],
      },
      "setupGuest": {
        methods: ["click"],
        objects: ["welcomeGuest"],
      },
      "fxaStart": {
        methods: ["click"],
        objects: ["welcomeSignin", "manageAcctCreate", "manageAcctSignin", "unlockSignin"],
      },
      "fxaAuth": {
        methods: ["fxaUpgrade", "fxaSignin", "fxaSignout"],
        objects: ["accounts"],
        extra_keys: ["fxauid"],
      },
      "fxaFail": {
        methods: ["fxaFailed"],
        objects: ["accounts"],
        extra_keys: ["message"],
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

    browser.runtime.onConnect.addListener((port) => {
      dispatcher.connect(port);
    });
  });
}

function shutdown(data, reason) {}

function install(data, reason) {
  if (reason === ADDON_INSTALL) {
    // Remember the original value for `signons.rememberSignons` so we can
    // restore it during uninstall, then disable it so it doesn't conflict with
    // us.
    Services.prefs.setBoolPref(
      ORIGINAL_REMEMBER_SIGNONS_PREF,
      Services.prefs.getBoolPref(REMEMBER_SIGNONS_PREF)
    );
    Services.prefs.setBoolPref(REMEMBER_SIGNONS_PREF, false);

    dispatcher.record({ type: "extension_installed" });
  } else if (reason === ADDON_UPGRADE) {
    dispatcher.record({
      type: "extension_upgraded",
      version: data.newVersion,
      oldVersion: data.oldVersion,
    });
  }
}

function uninstall(data, reason) {
  if (reason === ADDON_UNINSTALL) {
    // Restore the original value for `signons.rememberSignons`.
    if (Services.prefs.getBoolPref(REMEMBER_SIGNONS_PREF) === false) {
      Services.prefs.setBoolPref(
        REMEMBER_SIGNONS_PREF,
        Services.prefs.getBoolPref(ORIGINAL_REMEMBER_SIGNONS_PREF)
      );
    }
    Services.prefs.clearUserPref(ORIGINAL_REMEMBER_SIGNONS_PREF);
  }
}

// We need to reference these functions so that babel-plugin-rewire can see
// them for our tests.
startup;
shutdown;
install;
uninstall;
dispatcher;
EventDispatcher;
