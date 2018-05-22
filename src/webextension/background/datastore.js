/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as DataStore from "lockbox-datastore";
import * as telemetry from "./telemetry";
import UUID from "uuid";

function convertInfo2Item(info) {
  let title;
  try {
    title = (new URL(info.hostname)).host;
  } catch (ex) {
    title = info.hostname;
  }
  title = title.replace(/^www\./, "");

  const id = info.guid || `{${UUID()}}`;
  const origins = [ info.hostname, info.formSubmitURL, info.httpRealm ].
      filter((u) => !!u);

  let item = {
    id,
    title,
    origins,
    tags: [],
    entry: {
      kind: "login",
      username: info.username,
      password: info.password,
    },
  };
  return item;
}

const MSG_LIST = {
  type: "bootstrap_logins_list",
};
class BootstrapDataStore {
  constructor() {}

  async list() {
    const logins = await browser.runtime.sendMessage(MSG_LIST);

    let items = logins.items;
    items = items.map(convertInfo2Item);

    return items;
  }
  async get(id) {
    let all = await this.list();
    let one = all.find((i) => i.id === id);
    return one;
  }
  async add() {

  }
  async update() {

  }
  async remove() {

  }
}

let bootstrap;
export async function openBootstrap() {
  if (!bootstrap) {
    bootstrap = new BootstrapDataStore();
  }
  return bootstrap;
}

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

export const DEFAULT_APP_KEY = {
  "kty": "oct",
  "kid": "L9-eBkDrYHdPdXV_ymuzy_u9n3drkQcSw5pskrNl4pg",
  "k": "WsTdZ2tjji2W36JN9vk9s2AYsvp8eYy1pBbKPgcSLL4",
};

export function clearDataStore() {
  datastore = undefined;
}

export default async function openDataStore(cfg = {}) {
  if (!datastore) {
    datastore = await DataStore.open({
      ...cfg,
      recordMetric,
    });
  }
  return datastore;
}
