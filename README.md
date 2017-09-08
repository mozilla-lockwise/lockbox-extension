[![Build Status](https://travis-ci.org/mozilla-lockbox/lockbox-extension.svg?branch=master)](https://travis-ci.org/mozilla-lockbox/lockbox-extension) [![Coverage Status](https://coveralls.io/repos/github/mozilla-lockbox/lockbox-extension/badge.svg?branch=master)](https://coveralls.io/github/mozilla-lockbox/lockbox-extension?branch=master)

# Lockbox for Firefox

Lockbox for Firefox is a work-in-progress extension for Firefox to improve upon
Firefox's built-in password management. If you're interested, you should
probably come back later when we have more to show!

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

If you'd like to **build a signed extension .xpi**, you can run:

```sh
npm run-script packagesign
```

To specify the signing keys for jpm to use, use `npm config set`:

```sh
npm config set jwt_issuer=JWTissuer
npm config set jwt_secret=JWTsecret
```

:warning: In preparation for Firefox 57, legacy extensions are also disabled. So
users would need to flip the `extensions.legacy.enabled` preference, too.

## Quick Start

If you'd like to quickly **start up a new Firefox profile** with Lockbox
installed for development/testing, you can run:

```sh
npm run-script run
```

To include additional flags for a specific run, append them after `--`:

```sh
npm run-script run -- -b nightly
```

To specify flags to use regularly, use `npm config set jpm_runflags`:

```sh
npm config set jpm_runflags="-b nightly"
```

## License

This add-on is [licensed][license-link] under the Mozilla Public License,
version 2.0.

[license-link]: /LICENSE
