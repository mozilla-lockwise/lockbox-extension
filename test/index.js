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
  "./webextension/popup/unlock/index.js",
  "./webextension/settings/index.js",
];

const src = require.context("../src/", true, /\.js$/);
src.keys().filter((x) => {
  return !skippedSrc.includes(x);
}).forEach(src);
