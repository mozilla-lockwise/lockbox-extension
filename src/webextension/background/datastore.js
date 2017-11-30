/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as DataStore from "lockbox-datastore";
import * as telemetry from "./telemetry";

let datastore;

async function recordMetric(method, itemid, fields) {
  let extra = {
    itemid,
  };
  if (fields) {
    extra = {
      ...extra,
      fields,
    };
  }
  telemetry.recordEvent(method, "datastore", extra);
}

export default async function openDataStore(cfg) {
  if (!datastore) {
    cfg = cfg || {};
    datastore = await DataStore.open({
      ...cfg,
      recordMetric,
    });
  }
  return datastore;
}
