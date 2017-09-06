/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import datastore from "./datastore";
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

  browser.runtime.onMessage.addListener(async function(message, sender) {
    switch (message.type) {
    case "list_items":
      return {items: Array.from((await datastore.list()).values(),
                                makeItemSummary)};
    case "add_item": {
      await datastore.unlock();
      const item = await datastore.add(message.item);
      broadcast({type: "added_item", item}, sender);
      return {item};
    }
    case "update_item": {
      await datastore.unlock();
      const item = await datastore.update(message.item);
      broadcast({type: "updated_item", item}, sender);
      return {item};
    }
    case "remove_item":
      await datastore.remove(message.id);
      broadcast({type: "removed_item", id: message.id}, sender);
      return {};
    case "get_item":
      return {item: await datastore.get(message.id)};
    default:
      throw new Error(`unknown message type "${message.type}`);
    }
  });
}
