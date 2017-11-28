/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This is a string instead of a symbol since we need to be able to use it as a
// React `key` inside a list.
export const NEW_ITEM_ID = "new-item";

export function unflattenItem(item, id) {
  return {
    id,
    title: item.title,
    origins: item.origin ? [item.origin] : [],
    entry: {
      kind: "login",
      username: item.username,
      password: item.password,
      notes: item.notes,
    },
  };
}

export function flattenItem(item) {
  return {
    title: item.title,
    origin: item.origins[0] || "",
    username: item.entry.username,
    password: item.entry.password,
    notes: item.entry.notes,
  };
}
