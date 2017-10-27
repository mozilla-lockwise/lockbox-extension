# Lockbox Release Notes

## 0.1.1-alpha

_Date: 2017-10-30_

### What's New

* When installing this extension, Firefox will no longer prompt to save logins. Any logins saved in Firefox are still there, and you can still use it to autofill login forms, but the browser will not prompt to save new ones. This feature will be re-enabled if you uninstall Lockbox, and can be manually changed by the user in Firefox's preferences.([#211](https://github.com/mozilla-lockbox/lockbox-extension/issues/211))
* You now have the ability to reset Lockbox and start from scratch.([#137](https://github.com/mozilla-lockbox/lockbox-extension/issues/137))
* Front-end validation of fields in the editor ([#207](https://github.com/mozilla-lockbox/lockbox-extension/issues/207))
* New Alpha installations can now happen from [this page](https://mozilla-lockbox.github.io/lockbox-extension/) versus the email distribution of the link which results in a blank page after install.

### What's Fixed

* Improved localization including page titles ([#225](https://github.com/mozilla-lockbox/lockbox-extension/issues/225)) and default locale consistency ([#140](https://github.com/mozilla-lockbox/lockbox-extension/issues/140))
* Show/Hide password field no longer resizes the window ([#179](https://github.com/mozilla-lockbox/lockbox-extension/issues/179))
* Modal dialogs behave more consistently and even keeps entered text if the modal closes ([#162](https://github.com/mozilla-lockbox/lockbox-extension/issues/162))

### Known Issues

* There is no way to change your Lockbox master password.  If you forget your master password, you'll need to start over fresh by either:
  - Opening the this extension's Preferences and clicking the "`💥💣 Reset 💣💥`" button; or
  - Uninstalling and re-installing the extension
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.

## 0.1.0-alpha1

_Date: 2017-10-16_

### What's New

This is a pre-release of the Lockbox password manager for internal Mozilla employees.

This starts as a signed Firefox extension where you can:

* Create a Lockbox account with a master password to lock/unlock your data
* View entries
* Search entries
* Add, edit, and delete entries
* Copy username and password to clipboard
* Submit feedback

### Known Issues

* Lockbox has only been tested on Firefox 57 and above.  Installing on Firefox 56 or lower may not function at all. 
* There is no way to reset your Lockbox master password. If you forget your master password, you'll need to start over fresh by uninstalling and re-installing this extension.
* This is a Lockbox account, which stays local to your Firefox installation. There is no integration with Firefox accounts to sync (yet).
