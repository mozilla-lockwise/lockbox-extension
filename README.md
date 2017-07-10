# Lockbox for Firefox

Lockbox for Firefox is a work-in-progress extension for Firefox to improve upon
Firefox's built-in password management. If you're interested, you should
probably come back later when we have more to show!

## Building

If you'd like to build the .xpi from the latest master, simply run the
following:

```sh
$ make package
```

Note of course that the resulting add-on is unsigned, and likely won't work on
release versions of Firefox.

## License

This add-on is [licensed][license-link] under the Mozilla Public License,
version 2.0.

[license-link]: https://github.com/jimporter/gesticulate/blob/master/LICENSE

## For Development

*WARNING* This voids your warranty!

1. *Allow unsigned extensions* In "about:config" change `xpi.signatures.required` to `true`.
2. *Create a shortcut* In your (development) Firefox profile directory, add the file `lockbox@mozilla.org` to the `extensions` sub-directory (creating the sub-directory if it does not already exist; the contents of `lockbox@mozilla.org` is the full path to the extension's `src` directory.

*NOTE*  Firefox caches Javascript even from extensions.  To mitigate this, specify `-purgecaches` when launching Firefox to ensure extension JavaScript files are refreshed.
