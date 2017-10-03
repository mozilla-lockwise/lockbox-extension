## Releases

## Preparation

To **prepare the extension for a new version**, you must:

- update and commit the version in `package.json`
- update and commit the `CHANGELOG.md`
- tag, push, and merge to the `master` branch on GitHub

## Packaging

To **build a signed extension .xpi**, you must: commit and push to the
`production` branch (ideally as a merge commit from `master`) on GitHub.

## Extension Signing

Learn about the Test Pilot extension deployment and hosting process here:  
https://github.com/mozilla/testpilot/blob/master/docs/development/hosting.md

This repository is in the "testpilot-mozillaextension" Jenkins pipeline.
The CloudOps team manages access to, and can help report on, the status of the
builds.
