/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function parseFilterString(filter) {
  filter = filter.trim();
  if (!filter) {
    return [];
  }
  return filter.split(/\s+/);
}

function tryMakeURL(string, defaultProtocol = null) {
  let url = null;
  try {
    url = new URL(string);
  } catch (e) {
    if (defaultProtocol) {
      try {
        url = new URL(defaultProtocol + "//" + string);
      } catch (e) {}
    }
  }
  return {url, string};
}

function match(filterElement, value) {
  return value.toLocaleLowerCase().includes(filterElement.toLocaleLowerCase());
}

function matchURL(filterElement, value) {
  // If the user is in the middle of typing a URL or entered something not
  // URL-like in the origin field, just to a string comparison. This is safe for
  // strictly matching auto-filled URLs since they're always full hosts with
  // protocol (and possibly port).
  if (!filterElement.url || !value.url) {
    return match(filterElement.string, value.string);
  }
  return (filterElement.url.protocol === value.url.protocol &&
          filterElement.url.host === value.url.host);
}

function matchAny(filterElement, values, matcher = match) {
  for (let i of values) {
    if (matcher(filterElement, i)) {
      return true;
    }
  }
  return false;
}

export function filterItem(filter, item) {
  const title = item.title;
  const username = item.username;
  const origins = item.origins.map((i) => tryMakeURL(i, "https:"));

  for (let i of filter) {
    if (!match(i, title) && !match(i, username) &&
        !matchAny(tryMakeURL(i), origins, matchURL)) {
      return false;
    }
  }
  return true;
}
