/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { fakeStore } from "./datastore";

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
    if (!excludeSender || p.sender.contextId !== excludeSender.contextId)
      p.postMessage(message);
  }
}

browser.runtime.onMessage.addListener(async function(message, sender) {
  switch (message.type) {
  case "add_entry": {
    const entry = await fakeStore.add(message.entry);
    broadcast({type: "added_entry", entry}, sender);
    return {entry};
  }
  case "update_entry": {
    const entry = await fakeStore.update(message.entry);
    broadcast({type: "updated_entry", entry}, sender);
    return {entry};
  }
  case "remove_entry":
    await fakeStore.remove(message.id);
    broadcast({type: "removed_entry", id: message.id}, sender);
    return {};
  case "get_entry":
    return {entry: await fakeStore.get(message.id)};
  case "list_entries":
    return {entries: await fakeStore.list()};
  default:
    return null;
  }
});
