/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

const tests = require.context(".", true, /-test\.js$/);
tests.keys().forEach(tests);

// This is super-brittle, but should ensure that all (well, most!) source files
// are loaded so we have something approaching accurate coverage. Unfortunately,
// the combination of karma, webpack, and babel makes coverage inordinantly
// difficult to get.
const skippedSrc = [
  "./webextension/background/index.js",
  "./webextension/firstrun/index.js",
  "./webextension/list/manage/index.js",
  "./webextension/list/popup/index.js",
  "./webextension/unlock/index.js",
  "./webextension/settings/index.js",
];

const src = require.context("src", true, /\.js$/);
src.keys().filter((x) => {
  return !skippedSrc.includes(x);
}).forEach(src);
