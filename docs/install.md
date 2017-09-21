# Installing the Lockbox extension

## Installing dependencies

To **install the project dependencies**, you can run:

```sh
npm install
```

## Building the source code

To **build the project**, you can run:

```sh
npm run-script build
```

This puts all the necessary files in the `dist/` directory, which you can then
temporarily load into Firefox (e.g. `about:debugging`).

## Building the extension

To **build an extension .xpi**, you can run:

```sh
npm run-script package
```

:warning: The resulting add-on is unsigned and likely won't work on release
versions of Firefox. You can flip the `xpinstall.signatures.required` preference
on other channels accordingly.

:warning: In preparation for Firefox 57, legacy extensions are also disabled. So
you'll need to flip the `extensions.legacy.enabled` preference, too.

## Running the extension

To **run the extension in a Firefox Nightly** browser, you can run:

```sh
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
