# Directory Structure

The following provides a brief outline of the directory structure of this project.

## `docs/`

Documentation that gets built and deploy to GitHub pages (you're reading it!).

## `src/`

This is where all of the source code for this project lives (except for dependencies, of course). Most importantly, this is where the `bootstrap.js` file lives, which contains the entry points for the restartless XPCOM add-on wrapping our WebExtension.

### `src/webextension/`

Most of the interesting parts of the source code are in here, to be built as an embedded WebExtension.

#### `src/webextension/background/`

Any code meant to run in a background page lives here, such as the datastore and Firefox accounts code. For more information, see the [`README.md`][background-readme] in this directory.

#### `src/webextension/firstrun/`

The first-run page, shown to new users when they install the extension.

#### `src/webextension/list/`

Common code for all the list views in the extension, as well as the specific views themselves (in subdirectories). For more information, see the [`README.md`][list-readme] in this directory.

##### `src/webextension/list/manage/`

The full-tab management UI.

##### `src/webextension/list/popup/`

The "doorhanger" UI.

#### `src/webextension/locales/`

All the strings for each locale, in subdirectories with the locale name. For more information, see the [`README.md`][locales-readme] in this directory.

#### `src/webextension/settings/`

The settings UI.

#### `src/webextension/unlock/`

The doorhanger to be shown when the datastore is locked.

#### `src/webextension/widgets/`

All the common UI widgets used throughout the source. For more information, see the [`README.md`][widgets-readme] in this directory.

## `test/`

This is where all of the tests for this project live.

### `test/integration/`

End-to-end integration tests operating on a compiled version of the add-on running in Firefox. These tests are written in Python with Selenium.

### `test/unit/`

Unit tests testing individual components of the source code. These are writen in Javascript using Mocha/Chai and run via Karma. The subdirectories of this directory match the subdirectories of `src/webextension`.

[background-readme]: https://github.com/mozilla-lockbox/lockbox-extension/blob/master/src/webextension/background/README.md
[list-readme]: https://github.com/mozilla-lockbox/lockbox-extension/blob/master/src/webextension/list/README.md
[locales-readme]: https://github.com/mozilla-lockbox/lockbox-extension/blob/master/src/webextension/locales/README.md
[widgets-readme]: https://github.com/mozilla-lockbox/lockbox-extension/blob/master/src/webextension/widgets/README.md
