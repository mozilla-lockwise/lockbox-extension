/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import getAuthorization from "./authorization/index";

export async function recordEvent(category, method, object, extra) {
  const fxauid = getAuthorization().uid;
  if (fxauid) {
    extra = {...(extra || {}), fxauid};
  }

  return browser.runtime.sendMessage({
    type: "telemetry_event", category, method, object, extra,
  });
}
