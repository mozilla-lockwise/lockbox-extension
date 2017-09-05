/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { mount } from "enzyme";
import React from "react";
import { MessageContext } from "fluent/compat";
import {
  LocalizationProvider, ReactLocalization, isReactLocalization
} from "fluent-react/compat";

function *generateMessages() {
  const context = new MessageContext("en-US");
  yield context;
}

export function MockLocalizationProvider(props) {
  return (
    <LocalizationProvider messages={generateMessages()} {...props}/>
  );
}

export function MockLocalizationContext() {
  return new ReactLocalization(generateMessages());
}

export default function mountWithL10n(node, options = {}) {
  return mount(node, {
    context: {
      l10n: MockLocalizationContext(),
    },
    childContextTypes: {
      l10n: isReactLocalization,
    },
    ...options
  });
}
