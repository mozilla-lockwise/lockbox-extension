# Lockbox for Firefox

Lockbox for Firefox is a work-in-progress extension for Firefox to improve upon
Firefox's built-in password management. If you're interested, you should
probably come back later when we have more to show!

## Building

To build the project, simply call the following:

```sh
$ cd lockbox-extension/
$ npm install
$ npm run-script build
```

This puts all the necessary files in the `dist/` directory, which you can then
load into Firefox (e.g. `about:debugging`). If you'd like to build the .xpi,
you can run the following:

```sh
$ npm run-script package
```

If you'd like to quickly start up a new Firefox profile with Lockbox installed
for development/testing, you can call:

```sh
$ npm run-script run
```

Note of course that the resulting add-on is unsigned, and likely won't work on
release versions of Firefox. You can flip the `xpinstall.signatures.required`
preference on other channels accordingly.

## License

This add-on is [licensed][license-link] under the Mozilla Public License,
version 2.0.

[license-link]: /LICENSE
