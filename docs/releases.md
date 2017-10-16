## Releases

### Instructions

**NOTE:** These instructions assume:

* You are an administrator of the project `lockbox-extension`
* Your local git repository has a `upstream` remote pointing to `git@github.com:mozilla-lockbox/lockbox-extension.git`

1. Update "version" in package.json (and package-lock.json)
    - we follow the [semver](http://semver.org/) syntax
    - Alpha releases will be tagged with "-alpha" (e.g., "0.1.0-alpha")
    - Beta releases will be tagged with "-beta" (e.g., "0.x.0-beta")
    - Stable releases will **not** be tagged, and follow smever from the last Beta release (major, minor, and patch)
2. Update `docs/release-notes.md`
    - latest release goes to the top, under a second-level header
    - each release includes the sub headings "What's New", "What's Fixed", and "Known Issues"
    - consult with Product Management
2. Commit and ultimately merge to "master" branch
3. Merge and push "master" branch to "production" branch
    - `git checkout master`
    - `git pull upstream master` (to make sure you have the latest)
    - `git checkout production`
    - `git pull upstream production` (to make sure you have the latest)
    - `git merge master`
    - `git push upstream production`
    - Jenkins will now build and sign the extension (see "Extension Signing")
4. Tag the production branch at the version and push the tag
    - `git tag -a -m "Release 0.1.0" 0.1.0`
    - `git push upstream 0.1.0`
    - Travis CI will build and generate a GitHub Release
7. Edit the resulting GitHub Release
    - Set the GitHub Release title to match the version
    - Set the notes to match the `docs/release-notes.md`
    - Download the `signed-addon.xpi` and attach it to the release

### Extension Signing

Learn about the Test Pilot extension deployment and hosting process here:  
https://github.com/mozilla/testpilot/blob/master/docs/development/hosting.md

This repository is in the "testpilot-mozillaextension" Jenkins pipeline.
The CloudOps team manages access to, and can help report on, the status of the
builds.

The resulting files deployed are:

- Updates file for automatic browser extension updates: https://testpilot.firefox.com/files/lockbox@mozilla.com/updates.json
- Latest version of the signed extension XPI: https://testpilot.firefox.com/files/lockbox@mozilla.com/latest

Join #testpilot-bots in IRC for updates on the status of builds.
