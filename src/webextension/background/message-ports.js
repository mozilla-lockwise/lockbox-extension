/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import openDataStore, { openBootstrapStore, clearDataStore, DEFAULT_APP_KEY } from "./datastore";
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

let addonPort;

export default function initializeMessagePorts() {
  // setup port to receive messages from bootstrapped addon
  addonPort = browser.runtime.connect({ name: "webext-to-legacy" });
  addonPort.onMessage.addListener(async (message) => {
    switch (message.type) {
    case "extension_installed":
      openView("firstrun");
      break;
    case "extension_upgraded":
      openDataStore().then(async (datastore) => {
        if (!datastore.initialized) {
          openView("firstrun");
        }
      });
      break;
    default:
      break;
    }
  });

  browser.runtime.onConnect.addListener((port) => {
    ports.add(port);
    port.onDisconnect.addListener(() => ports.delete(port));
  });

  browser.runtime.onMessage.addListener(async (message, sender) => {
    switch (message.type) {
    case "get_account_details":
      return {account: getAccount().details()};
    case "open_view":
      return openView(message.name).then(() => ({}));
    case "close_view":
      return closeView(message.name).then(() => ({}));

    case "initialize":
      return openDataStore().then(async (datastore) => {
        await datastore.initialize({
          appKey: DEFAULT_APP_KEY,
        });
        await updateBrowserAction({datastore});
        if (message.view) {
          openView(message.view);
        }

        return {};
      });
    case "upgrade_account":
      return openDataStore().then(async (datastore) => {
        const account = await getAccount().signIn(message.action);
        const appKey = account.keys.get("https://identity.mozilla.com/apps/lockbox");
        const salt = account.uid;

        try {
          if (datastore.initialized && datastore.locked) {
            await datastore.unlock(DEFAULT_APP_KEY);
          }
          await datastore.initialize({ appKey, salt, rebase: true });
          await updateBrowserAction({ account, datastore });
          telemetry.recordEvent("fxaUpgrade", "accounts");
        } catch (err) {
          telemetry.recordEvent("fxaFailed", "accounts", { message: err.message });
          throw err;
        }

        broadcast({ type: "account_details_updated", account: account.details() });
        if (message.view) {
          openView(message.view);
        }

        return {};
      });
    case "reset":
      return openDataStore().then(async (datastore) => {
        const account = getAccount();

        await closeView();

        await datastore.reset();
        await account.signOut(true);
        // XXXX: put other reset calls here

        await updateBrowserAction({datastore});
        broadcast({type: "account_details_updated", account: account.details()});
        openView("firstrun");

        return {};
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(`failed to reset: ${err.message}`);
        throw err;
      });


    case "signin":
      return Promise.resolve(getAccount()).then(async (account) => {
        let appKey = DEFAULT_APP_KEY;
        try {
          if (account.mode !== accounts.AUTHENTICATED) {
            await account.signIn();
          }
          if (account.mode === accounts.AUTHENTICATED) {
            appKey = account.keys.get(accounts.APP_KEY_NAME);
          }

          // XXXX: Find a better way to affect recovery
          clearDataStore();
          const datastore = await openDataStore({ salt: account.uid });

          await datastore.unlock(appKey);
          await updateBrowserAction({ datastore });
          telemetry.recordEvent("fxaSignin", "accounts");
        } catch (err) {
          telemetry.recordEvent("fxaFailed", "accounts", { message: err.message });
          throw err;
        }

        broadcast({ type: "account_details_updated", account: account.details() });
        if (message.view) {
          openView(message.view);
        }

        return {};
      });
    case "signout":
      return openDataStore().then(async (datastore) => {
        // TODO: perform (light) signout from FxA
        const account = getAccount();

        await account.signOut();
        await datastore.lock();
        await updateBrowserAction({datastore});
        telemetry.recordEvent("fxaSignout", "accounts");
        broadcast({ type: "account_details_updated", account: account.details() });

        await closeView("manage");
        return {};
      });

    case "legacy_list_items":
      return openDataStore().then(async (ds) => {
        var entries = Array.from((await ds.list()).values(),
                                  makeItemSummary);
        telemetry.setScalar("datastoreCount", entries.length);
        return {items: entries};
      });
    case "legacy_get_item":
      return openDataStore().then(async (ds) => {
        return { item: await ds.get(message.id) };
      });
    case "legacy_update_item":
      return openDataStore().then(async (ds) => {
        const item = await ds.update(message.item);
        broadcast({ type: "updated_item", item }, sender);
        return { item };
      });

    case "list_items":
      return openBootstrapStore().then(async (ds) => {
        const entries = (await ds.list()).map(makeItemSummary);
        telemetry.setScalar("datastoreCount", entries.length);
        return { items: entries };
      });
    case "get_item":
      return openBootstrapStore().then(async (ds) => {
        return { item: await ds.get(message.id) };
      });
    case "add_item":
      return openDataStore().then(async (ds) => {
        const item = await ds.add(message.item);
        broadcast({type: "added_item", item}, sender);
        return {item};
      });
    case "update_item":
      return openBootstrapStore().then(async (ds) => {
        const item = await ds.update(message.item);
        broadcast({ type: "updated_item", item }, sender);
        return { item };
      });
    case "remove_item":
      return openDataStore().then(async (ds) => {
        await ds.remove(message.id);
        broadcast({type: "removed_item", id: message.id}, sender);
        return {};
      });

    case "proxy_telemetry_event":
      return telemetry.recordEvent(message.method, message.object,
                                   message.extra);
    case "proxy_telemetry_scalar":
        return telemetry.setScalar(message.name, message.value);
    default:
      return null;
    }
  });
}
