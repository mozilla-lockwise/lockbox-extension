/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as DataStore from "lockbox-datastore";
import * as telemetry from "./telemetry";

function convertInfo2Item(info) {
  let title;
  try {
    title = (new URL(info.hostname)).host;
  } catch (ex) {
    title = info.hostname;
  }
  title = title.replace(/^http:\/\//, "").
                replace(/^https:\/\//, "").
                replace(/^www\./, "");

  const id = info.guid;
  const origins = [ info.hostname, info.formSubmitURL ].
      filter((u) => !!u);

  let item = {
    id,
    title,
    origins,
    realm: info.httpRealm,
    tags: [],
    entry: {
      kind: "login",
      username: info.username,
      password: info.password,
      usernameField: info.usernameField,
      passwordField: info.passwordField,
      notes: "",
    },
  };
  return item;
}
function convertItem2Info(item) {
  // dropped on the floor (for now ...)
  // * title
  // * tags
  // * entry.notes
  // * history

  // item.id ==> info.guid
  // item.title ==> undefined
  // item.tags ==> undefined
  // item.origins[0] ==> info.hostname
  // item.origins[1] || null ==> info.formSubmitURL
  // item.entry.kind ==> undefined
  // item.entry.username ==> info.username
  // item.entry.password ==> info.password
  // item.entry.usernameField || "" ==> info.usernameField
  // item.entry.passwordField || "" ==> info.passwordField
  // item.entry.notes ==> info.undefined
  const guid = item.id;
  const hostname = item.origins[0];
  const formSubmitURL = item.origins[1] || null;
  const httpRealm = item.realm || null;
  const username = item.entry.username;
  const password = item.entry.password;
  const usernameField = item.entry.usernameField || "";
  const passwordField = item.entry.passwordField || "";

  let info = {
    guid,
    hostname,
    formSubmitURL,
    httpRealm,
    username,
    password,
    usernameField,
    passwordField,
  };

  return info;
}

class BootstrapDataStore {
  constructor() {}

  async _allLogins() {
    let all = await browser.runtime.sendMessage({ type: "bootstrap_logins_list" });
    return all.logins || [];
  }

  async list() {
    const logins = await this._allLogins();
    const items = logins.map(convertInfo2Item);

    return items;
  }
  async get(id) {
    let one = (await this.list()).find((item) => (item.id === id));

    return one || null;
  }
  async add() {
  }
  async update(item) {
    const id = item.id;
    if (!id) {
      throw new TypeError("id missing");
    }

    const info = convertItem2Info(item);
    const orig = await this.get(id);
    if (!orig) {
      throw new Error(`no existing item for ${id}`);
    }

    let updated = await browser.runtime.sendMessage({
      type: "bootstrap_logins_update",
      login: info,
    });
    if (!updated) {
      throw new Error("update failed");
    }
    updated = convertInfo2Item(updated);

    return updated;
  }
  async remove(id) {
    const item = await this.get(id);
    if (item) {
      const login = convertItem2Info(item);
      await browser.runtime.sendMessage({
        type: "bootstrap_logins_remove",
        login,
      });
    }
    return item || null;
  }
}

let bootstrap;
export async function openBootstrapStore() {
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
