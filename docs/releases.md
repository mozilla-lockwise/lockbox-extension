## Releases

### Instructions

1. Update "version" in package.json (and package-lock.json)
  - we follow the [semver](http://semver.org/) convention
  - versions "0.1.0" to "1.0.0" is reserved for the internal Alpha
  - version "1.0.0" is reserved for a public Beta
  - major, minor, and patch releases will follow semver from there
2. Update "CHANGELOG.md" using `conventional-changelog`
  - we follow the "angular" convention
  - review the resulting output in case anything is missed, unexpected, etc.
2. Commit and ultimately merge to "master" branch
3. Merge and push "master" branch to "production" branch
  - `git checkout master`
  - `git pull` (to make sure you have the latest)
  - `git checkout production`
  - `git pull` (to make sure you have the latest)
  - `git merge master`
  - `git push`
  - Jenkins will now build and sign the extension (see "Extension Signing")
4. Tag the production branch at the version
  - `git tag 0.1.0`
  - `git push --tags`
  - Travis CI will build and generate a GitHub Release
7. Edit the resulting GitHub Release
  - Set the GitHub Release title to match the version
  - Set the notes to match the CHANGELOG
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
