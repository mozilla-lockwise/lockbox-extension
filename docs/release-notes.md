# Lockbox Release Notes

## 0.1.8-alpha

_Date: 2018-03-08_

### What's New

- Added support For Telemetry Scalars so we can easily tell how many items are stored in your Lockbox datastore ([#552](https://github.com/mozilla-lockbox/lockbox-extension/pull/552))
- Made it so the search box is automatically focused so you can start typing to search your entries immediately ([#573](https://github.com/mozilla-lockbox/lockbox-extension/issues/573))
- The doorhanger also automatically fills the search with the domain of the current page you're viewing to help you quickly see matching entries ([#616](https://github.com/mozilla-lockbox/lockbox-extension/pull/616))
- Improved contrast and colors of the entry list for accessibility ([#560](https://github.com/mozilla-lockbox/lockbox-extension/pull/560))
- Improved interface colors and styles for entry list items ([#553](https://github.com/mozilla-lockbox/lockbox-extension/pull/553))
- Improved search bar interface style with a simpler "Clear" button ([#562](https://github.com/mozilla-lockbox/lockbox-extension/pull/562))
- Re-ordered the create/edit entry interface with improved spacing and styles ([#567](https://github.com/mozilla-lockbox/lockbox-extension/pull/567))

### What's Fixed

- Item notes with line breaks properly show those separate lines when editing ([#596](https://github.com/mozilla-lockbox/lockbox-extension/pull/596))
- The "reset Lockbox" settings interface fits better in about:addons ([#603](https://github.com/mozilla-lockbox/lockbox-extension/pull/603))
- Fixed alignment on the entry detail view so the buttons don't jump when switching between edit and view modes ([#608](https://github.com/mozilla-lockbox/lockbox-extension/pull/608))

### Known Issues

* Profile information about you is only fetched and updated when you sign in; any changes made to your Firefox Accounts display name or avatar will not be displayed in Lockbox until you sign in again.
* Once you link a Firefox Account to Lockbox, you cannot unlink it from that account.
* Once you link a Firefox Account to Lockbox, signing in with a different account can render Lockbox unusable until you quit and restart Firefox.
* Once you link a Firefox Account to Lockbox, resetting your Firefox Account password through "forgot your password" will render all your logins inaccessible; the only recourse is to reset Lockbox and start over.
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.

## 0.1.7-alpha1

_Date: 2018-02-23_

This release is to address a critical defect from the previous release.

### What's Fixed

* If you linked your Firefox Account, Lockbox would stop working when you restart Firefox ([#568](https://github.com/mozilla-lockbox/lockbox-extension/issues/568))

### Known Issues

* Profile information about you is only fetched and updated when you sign in; any changes made to your Firefox Accounts display name or avatar will not be displayed in Lockbox until you sign in again.
* Once you link a Firefox Account to Lockbox, you cannot unlink it from that account.
* Once you link a Firefox Account to Lockbox, signing in with a different account can render Lockbox unusable until you quit and restart Firefox.
* Once you link a Firefox Account to Lockbox, resetting your Firefox Account password through "forgot your password" will render all your logins inaccessible; the only recourse is to reset Lockbox and start over.
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.


## 0.1.7-alpha

_Date: 2018-02-22_

### What's New

* To provide you with a closer brand experience with Firefox, the visual design and interaction of the account actions dropdown in the full editor view better aligns with Firefox's [Photon design](https://design.firefox.com/photon) ([#524](https://github.com/mozilla-lockbox/lockbox-extension/issues/524))

### What's Fixed

* If you use Lockbox in "Guest" mode (not linked to a Firefox Account), it can be unusable when Firefox is next restarted ([#542](https://github.com/mozilla-lockbox/lockbox-extension/issues/542)) 
* Via Greenkeeper:
    * Updated `events` dependency ([#509](https://github.com/mozilla-lockbox/lockbox-extension/pull/509))
    * Updated `babel-minify-webpack-plugin` dependency ([#525](https://github.com/mozilla-lockbox/lockbox-extension/pull/525))
    * Updated `eslint-plugin-node` dependency ([#518](https://github.com/mozilla-lockbox/lockbox-extension/pull/518))
    * Updated `eslint-plugin-mozilla` dependency ([#546](https://github.com/mozilla-lockbox/lockbox-extension/pull/546))

### Known Issues

* Profile information about you is only fetched and updated when you sign in; any changes made to your Firefox Accounts display name or avatar will not be displayed in Lockbox until you sign in again.
* Once you link a Firefox Account to Lockbox, you cannot unlink it from that account.
* Once you link a Firefox Account to Lockbox, signing in with a different account can render Lockbox unusable until you quit and restart Firefox.
* Once you link a Firefox Account to Lockbox, resetting your Firefox Account password through "forgot your password" will render all your logins inaccessible; the only recourse is to reset Lockbox and start over.
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.


## 0.1.6-alpha

_Date: 2018-02-08_

### What's New

* When you copy a username or password from the doorhanger to the clipboard, you now get confirmation of that action ([#318](https://github.com/mozilla-lockbox/lockbox-extension/issues/318))
* When signed in with the full editor view open, it displays additional profile information you have set on Firefox Accounts to better personalize your experience ([#417](https://github.com/mozilla-lockbox/lockbox-extension/issues/417))
* When signed in with the full editor view open, you can better manage your Firefox Account ([#442](https://github.com/mozilla-lockbox/lockbox-extension/issues/442))
* You can now sign out of Lockbox, locking down your entries without quitting Firefox ([#149](https://github.com/mozilla-lockbox/lockbox-extension/issues/149))

### What's Fixed

* Cleaned up obsolete or erroneous localization usage ([#240](https://github.com/mozilla-lockbox/lockbox-extension/issues/240))
* Activated Greenkeeper to mitigate stale dependencies ([#276](https://github.com/mozilla-lockbox/lockbox-extension/issues/276))
    * Updated `style-loader` dependency ([#502](https://github.com/mozilla-lockbox/lockbox-extension/pull/502))

### Known Issues

* Once you link a Firefox Account to Lockbox, you cannot unlink it from that account.
* Once you link a Firefox Account to Lockbox, signing in with a different account can render Lockbox unusable until you quit and restart Firefox.
* Once you link a Firefox Account to Lockbox, resetting your Firefox Account password through "forgot your password" will render all your logins inaccessible; the only recourse is to reset Lockbox and start over.
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.


## 0.1.5-alpha

_Date: 2018-01-30_

### What's New

* There is a version query param to the SurveyGizmo link for better feedback tracking ([#388](https://github.com/mozilla-lockbox/lockbox-extension/issues/388))
* We're now using greenkeeper to help keep up dependencies ([#276](https://github.com/mozilla-lockbox/lockbox-extension/issues/276))

### What's Fixed

* Addressed a syntax error causing warnings in the build around the prop type:ScrollingList ([#451](https://github.com/mozilla-lockbox/lockbox-extension/issues/451))
* Clicking "New entry" button while editing an entry no longer duplicates the entry ([#438](https://github.com/mozilla-lockbox/lockbox-extension/issues/438))
* Added stylelint CSS linter to better catch programming errors ([#352](https://github.com/mozilla-lockbox/lockbox-extension/issues/352))
* The `expires_at` value during FxA login is now valid ([#430](https://github.com/mozilla-lockbox/lockbox-extension/issues/430))
* The "guest mode" key is now defined in the extension and not the shared datastore module ([#435](https://github.com/mozilla-lockbox/lockbox-extension/issues/435))
* There is no longer an odd blue background when selecting items from left side list ([#414](https://github.com/mozilla-lockbox/lockbox-extension/issues/414))


### Known Issues

* Once you link a Firefox Account to Lockbox, you cannot unlink it from that account.
* Once you link a Firefox Account to Lockbox, signing in with a different account can render Lockbox unusable until you quit and restart Firefox.
* Once you link a Firefox Account to Lockbox, resetting your Firefox Account password through "forgot your password" will render all your logins inaccessible; the only recourse is to reset Lockbox and start over.
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.


## 0.1.4-alpha

_Date: 2017-12-13_

### What's New

- Access your saved Lockbox entries from a doorhanger experience ([#338](https://github.com/mozilla-lockbox/lockbox-extension/pull/362))
- Secure your Lockbox with a Firefox Account ([#362](https://github.com/mozilla-lockbox/lockbox-extension/pull/362))
- See the visual design and polish come together for the entire experience ([#351](https://github.com/mozilla-lockbox/lockbox-extension/pull/351))
- Get help and instructions when you first get started ([#392](https://github.com/mozilla-lockbox/lockbox-extension/issues/392))
- Get additional support from the updated [Lockbox website](https://mozilla-lockbox.github.io/lockbox-extension/), including the FAQ ([#345](https://github.com/mozilla-lockbox/lockbox-extension/issues/345))

### Known Issues

* **Any existing Lockbox entries from previous versions have been removed.** Previous versions were storing and encrypting data differently than we are now. In order to add our new security features your old data can no longer be read/accessed and you'll see an empty state after you upgrade.
* Once you link a Firefox Account to Lockbox, you cannot unlink it from that account.
* Once you link a Firefox Account to Lockbox, signing in with a different account can render Lockbox unusable until you quit and restart Firefox.
* Once you link a Firefox Account to Lockbox, resetting your Firefox Account password through "forgot your password" will render all your logins inaccessible; the only recourse is to reset Lockbox and start over.
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.

## 0.1.3-alpha

_Date: 2017-11-29_

### What's New

* We added placeholder text into the item editor to help show what's expected  ([#336](https://github.com/mozilla-lockbox/lockbox-extension/pull/336))
* Every time the "Copy" button is used we'll log a Telemetry event ([#342](https://github.com/mozilla-lockbox/lockbox-extension/pull/342))

### What's Fixed

* Our friendly monster looks a bit better on light backgrounds ([#347](https://github.com/mozilla-lockbox/lockbox-extension/pull/347))
* We've updated some dependencies, including React, so that we're using and testing against the latest and greatest ([#346](https://github.com/mozilla-lockbox/lockbox-extension/pull/346)) ([#335](https://github.com/mozilla-lockbox/lockbox-extension/pull/335))

### Known Issues

* This is pre-release software subject to change. Your data may not be retained.
* There is no way to change your Lockbox master password. If you forget your master password, you'll need to start over fresh by either:
  - Opening the this extension's Preferences and clicking the "`💥💣 Reset 💣💥`" button; or
  - Uninstalling and re-installing the extension
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.

## 0.1.2-alpha

_Date: 2017-11-13_

### What's New

* Interface styles updated to more closely match Photon design language ([#295](https://github.com/mozilla-lockbox/lockbox-extension/pull/295)) ([#307](https://github.com/mozilla-lockbox/lockbox-extension/pull/307))
* Improved user interface design on welcome screen and home page ([#300](https://github.com/mozilla-lockbox/lockbox-extension/issues/300))
* Updated content throughout the interface to guide the user experience ([#165](https://github.com/mozilla-lockbox/lockbox-extension/issues/165))

### What's Fixed

* Clicking the toolbar (browser action) icon would not open the editor if the editor was opened and the user changed the URL ([#262](https://github.com/mozilla-lockbox/lockbox-extension/issues/262))
* The toolbar icon did not invert to light colors on dark themes ([#306](https://github.com/mozilla-lockbox/lockbox-extension/pull/306))

### Known Issues

* This is pre-release software subject to change. Your data may not be retained.
* There is no way to change your Lockbox master password. If you forget your master password, you'll need to start over fresh by either:
  - Opening the this extension's Preferences and clicking the "`💥💣 Reset 💣💥`" button; or
  - Uninstalling and re-installing the extension
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.

## 0.1.1-alpha1

_Date: 2017-11-01_

### What's Fixed

* We added language to the first-run experience to remind testers that this is pre-release software and both **subject to change and data may not be retained**.

### Known Issues

* There is no way to change your Lockbox master password.  If you forget your master password, you'll need to start over fresh by either:
  - Opening the this extension's Preferences and clicking the "`💥💣 Reset 💣💥`" button; or
  - Uninstalling and re-installing the extension
* Firefox's default prompt to save logins is only disabled on new installs of this extension; updating Lockbox will not change your current Firefox preferences.

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
