/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global ADDON_INSTALL, ADDON_UPGRADE, ADDON_UNINSTALL, LoginHelper */
/* eslint-disable no-unused-vars */

const { utils: Cu } = Components;

ChromeUtils.import("resource://gre/modules/Services.jsm");
const LoginInfo = Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
                                         "nsILoginInfo",
                                         "init");
ChromeUtils.defineModuleGetter(this,
                               "LoginHelper",
                               "resource://gre/modules/LoginHelper.jsm");

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

function addLogin(info) {
  let added = null;
  try {
    added = LoginHelper.vanillaObjectToLogin(info);
    added = Services.logins.addLogin(added);
    added = LoginHelper.loginToVanillaObject(added);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log(`could not update login: (${ex.name}) ${ex.message}`);
  }

  return added;
}
function modifyLogin(info) {
  // find original login
  const query = {
    guid: info.guid,
  };
  const found = LoginHelper.searchLoginsWithObject(query);
  if (!found.length) {
    return null;
  }

  let updated = null;
  try {
    const orig = found[0];
    const pending = LoginHelper.newPropertyBag(info);
    updated = LoginHelper.buildModifiedLogin(orig, pending);
    Services.logins.modifyLogin(orig, updated);
    updated = LoginHelper.loginToVanillaObject(updated);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log(`could not update login: (${ex.name}) ${ex.message}`);
  }

  return updated;
}
function removeLogin(info) {
  try {
    const login = LoginHelper.vanillaObjectToLogin(info);
    Services.logins.removeLogin(login);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log(`could not remove login: (${ex.name}) ${ex.message}`);
    return null;
  }

  return {};
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
      },
      "displayView": {
        methods: ["render"],
        objects: ["firstrun", "popupUnlock", "manage", "doorhanger"],
      },
      "itemAdding": {
        methods: ["itemAdding"],
        objects: ["manage"],
      },
      "itemUpdating": {
        methods: ["itemUpdating"],
        objects: ["manage"],
      },
      "itemDeleting": {
        methods: ["itemDeleting"],
        objects: ["manage"],
      },
      "itemAdded": {
        methods: ["itemAdded"],
        objects: ["manage"],
        extra_keys: ["itemid"],
      },
      "itemUpdated": {
        methods: ["itemUpdated"],
        objects: ["manage"],
        extra_keys: ["itemid"],
      },
      "itemDeleted": {
        methods: ["itemDeleted"],
        objects: ["manage"],
        extra_keys: ["itemid"],
      },
      "itemSelected": {
        methods: ["itemSelected"],
        objects: ["manage", "doorhanger"],
      },
      "addClick": {
        methods: ["addClick"],
        objects: ["manage"],
      },
      "datastore": {
        methods: ["added", "updated", "deleted"],
        objects: ["datastore"],
        extra_keys: ["itemid", "fields"],
      },
      "feedback": {
        methods: ["feedbackClick"],
        objects: ["manage"],
      },
      "faq": {
        methods: ["faqClick"],
        objects: ["manage"],
      },
      "itemCopied": {
        methods: ["usernameCopied", "passwordCopied"],
        objects: ["manage", "doorhanger"],
      },
      "resetRequested": {
        methods: ["resetRequested"],
        objects: ["settings"],
      },
      "resetCompleted": {
        methods: ["resetCompleted"],
        objects: ["settings"],
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

  try {
    Services.telemetry.registerScalars(TELEMETRY_CATEGORY, {
      "datastoreCount": {
        kind: Services.telemetry.SCALAR_TYPE_COUNT,
        keyed: false,
        record_on_release: false,
        expired: false,
      },
    });
  } catch (e) {
    if (e.message === "Attempt to register scalar that is already registered.") {
      // eslint-disable-next-line no-console
      console.log("telemetry scalar already registered; skipping registration");
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
        break;
      case "telemetry_scalar":
        Services.telemetry.scalarSet(
          `${TELEMETRY_CATEGORY}.${message.name}`, message.value
        );
        respond({});
        break;

      case "bootstrap_logins_list":
        respond({
          logins: Services.logins.
              getAllLogins().
              filter((l) => !(l.hostname || "").startsWith("chrome://")).
              map(LoginHelper.loginToVanillaObject),
        });
        break;
      case "bootstrap_logins_add":
        respond(addLogin(message.login));
        break;
      case "bootstrap_logins_update":
        respond(modifyLogin(message.login));
        break;
      case "bootstrap_logins_remove":
        respond(removeLogin(message.login));
        break;
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
    dispatcher.record({ type: "extension_installed" });
  }
}

function uninstall(data, reason) {}

// We need to reference these functions so that babel-plugin-rewire can see
// them for our tests.
startup;
shutdown;
install;
uninstall;
dispatcher;
EventDispatcher;
