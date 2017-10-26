/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

window.ADDON_INSTALL = "ADDON_INSTALL";
window.ADDON_UNINSTALL = "ADDON_UNINSTALL";

window.Components = {
  utils: {
    "import": function() {},
  },
};

window.Services = {
  prefs: {
    _prefs: {},

    getBoolPref(key) {
      return this._prefs[key] || false;
    },

    setBoolPref(key, value) {
      this._prefs[key] = value;
    },

    clearUserPref(key) {
      delete this._prefs[key];
    },

    prefHasUserValue(key) {
      return key in this._prefs;
    },

    mockResetPrefs() {
      this._prefs = {};
    },
  },

  telemetry: {
    registerEvents() {},
    recordEvent() {},
  },
};
