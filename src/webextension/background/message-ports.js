/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import openDataStore from "./datastore";
import getAccount, * as accounts from "./accounts";
import updateBrowserAction from "./browser-action";
import * as telemetry from "./telemetry";
import { openView, closeView } from "./views";
import { makeItemSummary } from "../common";

const ports = new Set();

function broadcast(message, excludedSender) {
  for (let p of ports) {
    if (!excludedSender || p.sender.contextId !== excludedSender.contextId) {
      p.postMessage(message);
    }
  }
}

export default function initializeMessagePorts() {
  browser.runtime.onConnect.addListener((port) => {
    ports.add(port);
    port.onDisconnect.addListener(() => ports.delete(port));
  });

  browser.runtime.onMessage.addListener(async (message, sender) => {
    switch (message.type) {
    case "open_view":
      return openView(message.name).then(() => ({}));
    case "close_view":
      return closeView(message.name).then(() => ({}));

    case "signin":
      return getAccount().signIn();
    case "initialize":
      return openDataStore().then(async (datastore) => {
        await datastore.initialize();
        // FIXME: be more implicit on saving account info
        await accounts.saveAccount(browser.storage.local);
        await updateBrowserAction({datastore});
        if (!message.silent) {
          await openView("manage");
        }

        return {};
      });
    case "upgrade":
      return openDataStore().then(async (datastore) => {
        let account = await getAccount().signIn(true);
        console.log(`signed in with account ${JSON.stringify(account)}`);
        let appKey = account.keys.get("https://identity.mozilla.com/apps/lockbox");
        console.log(` ... using appKey ${JSON.stringify(appKey)}`);
        let salt = account.uid;
        console.log(` ... and salt ${salt}`);

        if (datastore.initialized && datastore.locked) {
          console.log(`unlocking datastore ...`);
          await datastore.unlock();
          console.log(`datastore unlocked ...`);
        }
        console.log(`rebase/initialize datastore ...`);
        await datastore.initialize({ appKey, salt, rebase: true });
        console.log(`datastore rebased; save and update browser-action ...`);
        // FIXME: be more implicit on saving account info
        await accounts.saveAccount(browser.storage.local);
        await updateBrowserAction({account, datastore});
        if (!message.silent) {
          await openView("manage");
        }

        return {};
      });
    case "reset":
      return openDataStore().then(async (datastore) => {
        await closeView();

        await datastore.reset();
        // TODO: put other reset calls here

        await updateBrowserAction({datastore});
        await openView("firstrun");

        return {};
      });


    case "unlock":
      return openDataStore().then(async (datastore) => {
        await datastore.unlock(message.password);
        await updateBrowserAction({datastore});
        return {};
      });
    case "lock":
      return openDataStore().then(async (datastore) => {
        await datastore.lock();
        await updateBrowserAction({datastore});
        return {};
      });

    case "list_items":
      return openDataStore().then(async (ds) => {
        return {items: Array.from((await ds.list()).values(),
                                  makeItemSummary)};
      });
    case "add_item":
      return openDataStore().then(async (ds) => {
        const item = await ds.add(message.item);
        broadcast({type: "added_item", item}, sender);
        return {item};
      });
    case "update_item":
      return openDataStore().then(async (ds) => {
        const item = await ds.update(message.item);
        broadcast({type: "updated_item", item}, sender);
        return {item};
      });
    case "remove_item":
      return openDataStore().then(async (ds) => {
        await ds.remove(message.id);
        broadcast({type: "removed_item", id: message.id}, sender);
        return {};
      });
    case "get_item":
      return openDataStore().then(async (ds) => {
        return {item: await ds.get(message.id)};
      });

    case "proxy_telemetry_event":
      return telemetry.recordEvent(message.method, message.object,
                                   message.extra);
    default:
      return null;
    }
  });
}
