/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import ReactDOM from "react-dom";

import AppLocalizationProvider from "../../l10n";
import App from "./components/app";
import * as telemetry from "../../telemetry";

// This is the closest approximation we can get to a toolbar click when the
// popup is registered.
telemetry.recordEvent("render", "popupUnlock");

ReactDOM.render(
  <AppLocalizationProvider bundles={["popup", "widgets", "common"]}
                           userLocales={navigator.languages}>
    <App/>
  </AppLocalizationProvider>,
  document.getElementById("content")
);
