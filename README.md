[![Build Status][travis-image]][travis-link]
[![Coverage Status][codecov-image]][codecov-link]

# Lockbox for Firefox

Lockbox for Firefox is a work-in-progress extension for Firefox to improve upon
Firefox's built-in password management. If you're interested, you should
probably come back later when we have more to show!

## Quick Start

If you'd like to quickly **start up a new Firefox profile on Nightly** with
Lockbox installed for development/testing, you can run:

```sh
npm install
npm run-script run -- -b nightly
```

To specify flags for `run` to use regularly, use `npm config set jpm_runflags`:

```sh
npm config set jpm_runflags="-b nightly"
```

This way you can just run:

```sh
npm run run
```

## Installing

To **install the project dependencies**, you can run:

```sh
npm install
```

## Building

To **build the project**, you can run:

```sh
npm run-script build
```

This puts all the necessary files in the `dist/` directory, which you can then
temporarily load into Firefox (e.g. `about:debugging`).

If you'd like to **build an extension .xpi**, you can run:

```sh
npm run-script package
```

:warning: The resulting add-on is unsigned and likely won't work on release
versions of Firefox. You can flip the `xpinstall.signatures.required` preference
on other channels accordingly.

:warning: In preparation for Firefox 57, legacy extensions are also disabled. So
you'll need to flip the `extensions.legacy.enabled` preference, too.

## Releasing

To **prepare the extension for a new version**, you must:

- update and commit the version in `package.json`
- update and commit the `CHANGELOG.md`
- tag, push, and merge to the `master` branch on GitHub

To **build a signed extension .xpi**, you must: commit and push to the
`production` branch (ideally as a merge commit from `master`) on GitHub.

Learn more about the deployment and hosting process here:
https://github.com/mozilla/testpilot/blob/master/docs/development/hosting.md

## License

This add-on is [licensed][license-link] under the Mozilla Public License,
version 2.0.

[travis-image]: https://travis-ci.org/mozilla-lockbox/lockbox-extension.svg?branch=master
[travis-link]: https://travis-ci.org/mozilla-lockbox/lockbox-extension
[codecov-image]: https://img.shields.io/codecov/c/github/mozilla-lockbox/lockbox-extension.svg
[codecov-link]: https://codecov.io/gh/mozilla-lockbox/lockbox-extension
[license-link]: /LICENSE
