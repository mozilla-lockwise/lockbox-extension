/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import openDataStore from "./datastore";
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

const ORIGINAL_REMEMBER_SIGNONS_PREF = "originalRememberSignons";

export default function initializeMessagePorts() {
  // setup port to receive messages from bootstrapped addon
  addonPort = browser.runtime.connect({ name: "webext-to-legacy" });
  addonPort.onMessage.addListener(async (message) => {
    switch (message.type) {
    case "extension_installed":
      browser.privacy.services.passwordSavingEnabled.get({}).then(async (pref) => {
        // if password saving is disabled, enable it and save the original value ...
        if (!pref.value) {
          await browser.privacy.services.passwordSavingEnabled.set({
            value: true,
          });
          browser.storage.local.set({
            ORIGINAL_REMEMBER_SIGNONS_PREF: pref,
          });
        }
        openView("manage");
      });
      break;
    case "extension_uninstalled":
      browser.storage.local.get(ORIGINAL_REMEMBER_SIGNONS_PREF).then(async (got) => {
        // If missing from local storage, assume the original was `true` to prevent changing it
        const orig = got[ORIGINAL_REMEMBER_SIGNONS_PREF] || true;
        if (!orig) {
          await browser.privacy.services.passwordSavingEnabled.set({
            value: orig,
          });
        }
      });
      break;

    case "login_changed":
      openDataStore().then(async (ds) => {
          const mode = message.mode;
          const item = message.login && ds.toItem(message.login);

          broadcast({
            type: `${mode}_item`,
            item,
          }, false);
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
    case "open_view":
      return openView(message.name).then(() => ({}));
    case "close_view":
      return closeView(message.name).then(() => ({}));

    case "list_items":
      return openDataStore().then(async (ds) => {
        const entries = (await ds.list()).map(makeItemSummary);
        telemetry.setScalar("datastoreCount", entries.length);
        return { items: entries };
      });
    case "get_item":
      return openDataStore().then(async (ds) => {
        return { item: await ds.get(message.id) };
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
