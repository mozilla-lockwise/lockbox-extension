/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const defaultFilter = [];

export function parseFilterString(filter) {
  filter = filter.trim();
  if (!filter) {
    return [];
  }
  return filter.split(/\s+/).map((i) => i.toLocaleLowerCase());
}

export function filterItem(filter, item) {
  for (let i of filter) {
    if (!item.title.toLocaleLowerCase().includes(i) &&
        !item.username.toLocaleLowerCase().includes(i)) {
      return false;
    }
  }
  return true;
}
