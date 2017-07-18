/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import React from "react";
import ReactDOM from "react-dom";

import { AppLocalizationProvider } from "./l10n";

ReactDOM.render(
  <AppLocalizationProvider userLocales={navigator.languages}>
    <Localized id="hello">
      <h1>hELLo, wORLd!</h1>
    </Localized>
  </AppLocalizationProvider>,
  document.getElementById("content")
);
