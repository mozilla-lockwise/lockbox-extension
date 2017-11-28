/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import openDataStore from "./datastore";
import getAccount, { saveAccount } from "./accounts";
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
      return getAccount().signIn(message.interactive);
    case "initialize":
      return openDataStore().then(async (ds) => {
        await ds.initialize({
          password: message.password,
        });
        await saveAccount(browser.storage.local);
        await updateBrowserAction(ds);
        return {};
      });
    case "reset":
      return openDataStore().then(async (ds) => {
        await closeView();

        await ds.reset();
        // TODO: put other reset calls here

        await updateBrowserAction(ds);
        await openView("firstrun");

        return {};
      });


    case "unlock":
      return openDataStore().then(async (ds) => {
        await ds.unlock(message.password);
        await updateBrowserAction(ds);
        return {};
      });
    case "lock":
      return openDataStore().then(async (ds) => {
        await ds.lock();
        await updateBrowserAction(ds);
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
