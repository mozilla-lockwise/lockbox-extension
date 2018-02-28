/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import getAccount from "./accounts";

export async function recordEvent(method, object, extra) {
  const fxauid = getAccount().uid;
  if (fxauid) {
    extra = {...(extra || {}), fxauid};
  }

  return browser.runtime.sendMessage({
    type: "telemetry_event", method, object, extra,
  });
}

export async function setScalar(name, value) {
  return browser.runtime.sendMessage({
    type: "telemetry_scalar", name, value,
  });
}
