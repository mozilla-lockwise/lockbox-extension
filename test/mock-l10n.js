/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import { MessageContext } from "fluent/compat";
import { LocalizationProvider } from "fluent-react/compat";

function *generateMessages() {
  const context = new MessageContext("en-US");
  yield context;
}

export default function MockLocalizationProvider(props) {
  return (
    <LocalizationProvider messages={generateMessages()} {...props}/>
  );
}
