# Lockbox for Firefox

Lockbox for Firefox is a work-in-progress extension for Firefox to improve upon
Firefox's built-in password management. If you're interested, you should
probably come back later when we have more to show!

## Building

To **build the project**, simply run:

```sh
$ cd lockbox-extension/
$ npm install
$ npm run-script build
```

This puts all the necessary files in the `dist/` directory, which you can then
load into Firefox (e.g. `about:debugging`).

If you'd like to **build an .xpi**, you can run:

```sh
$ npm run-script package
```

The resulting add-on is unsigned and likely won't work on release versions of
Firefox. You can flip the `xpinstall.signatures.required` preference on other
channels accordingly.

If you'd like to quickly **start up a new Firefox profile** with Lockbox
installed for development/testing, you can run:

```sh
$ npm run-script run
```

To include additional flags for a specific run, append them after `--`:

```
npm run-script run -- -b nightly
```

To specify flags to use regularly, use `npm config set jpm_runflags`:

```
npm config set jpm_runflags="-b nightly"
```

## License

This add-on is [licensed][license-link] under the Mozilla Public License,
version 2.0.

[license-link]: /LICENSE
