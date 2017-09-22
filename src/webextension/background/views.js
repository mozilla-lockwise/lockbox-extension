/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const views = new Map();
export async function openView(name) {
  console.log(`opening view ${name} ...`);
  let id = views.get(name);
  let info;
  if (id) {
    try {
      info = await browser.tabs.get(id);
    } catch (err) {
      views.delete(info);
      info = null;
    }
  }

  if (info) {
    let { windowId } = info;
    await browser.windows.update(windowId, {
      focused: true,
    })
    info = await browser.tabs.update(id, {
      active: true,
    });
  } else {
    let url = browser.extension.getURL(`${name}/index.html`);
    info = await browser.tabs.create({
      url,
    });
    id = info.id;
    views.set(name, id);
  }

  return id;
}
export async function closeView(name) {
  let id = views.get(name);
  try {
    id && await browser.tabs.remove(id);
  } catch (err) {
    // TODO: loggit?
    console.log(`could not closed view for ${name}: ${err.message}`);
  }
  views.delete(name);
}
