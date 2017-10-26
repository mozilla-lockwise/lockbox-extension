/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import ReactDOM from "react-dom";

import App from "./components/app";
import AppLocalizationProvider from "../l10n";

ReactDOM.render(
  <AppLocalizationProvider bundles={["settings", "widgets"]}
                           userLocales={navigator.languages}>
    <App/>
  </AppLocalizationProvider>,
  document.getElementById("content")
);
