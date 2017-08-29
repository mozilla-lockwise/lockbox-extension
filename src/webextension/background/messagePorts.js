/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import datastore from "./datastore";
import { makeItemSummary } from "../common";

const ports = new Set();
browser.runtime.onConnect.addListener((port) => {
  ports.add(port);
  port.onDisconnect.addListener(() => {
    console.log("message port disconnected");
    ports.delete(port);
  });
});

function broadcast(message, excludeSender = null) {
  for (let p of ports) {
    if (!excludeSender || p.sender.contextId !== excludeSender.contextId) {
      p.postMessage(message);
    }
  }
}

browser.runtime.onMessage.addListener(async function(message, sender) {
  switch (message.type) {
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
  case "list_items":
    return {items: Array.from((await datastore.list()).values(),
                              makeItemSummary)};
  default:
    return null;
  }
});
