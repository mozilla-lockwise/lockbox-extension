## What’s the difference between Lockbox and the Firefox password manager?

Firefox password manager is the built-in feature that saves and autofills website login information. You can protect these logins with a master password. 

Lockbox is a stand-alone password manager extension that you can secure with a Firefox Account for newer encryption than what is offered with password manager. 

The alpha version of Lockbox lets you create, store and manage entries (a site’s username and password) and copy and paste login information. We realize managing passwords this way may feel very manual, but we plan to add features like autofill and password generation in future releases. We are also working to build cloud backup, create a mobile app, and support multiple browsers.

## Can I use Lockbox and the Firefox password manager at the same time?

No. When you install Lockbox, Firefox automatically disables the password manager. If you disable or delete Lockbox, Firefox re-enables password manager on the browser’s next restart.

## If I disable or delete Lockbox, will login information from my entries transfer into the password manager?

No. But login information you previously added to password manager will still be available.

## Does Lockbox import my information from password manager?

Not in the current alpha version.

## What security technology does Lockbox use?

When you protect Lockbox with a Firefox Account, Lockbox uses [AES256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) encryption, a tamper-resistent block cipher technology, to protect your data. Lockbox also uses [HMAC SHA-256](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code) to “hash” searchable data for additional security. 

## How do I disable or delete Lockbox?

1. Click the menu button ![menu](https://user-images.githubusercontent.com/49511/33676293-a3470a0c-da72-11e7-9f93-2f054bc16cb9.png)
 and choose Add-ons ![extensions](https://user-images.githubusercontent.com/49511/33676294-a35f8b5e-da72-11e7-8bfa-186708b20aab.png)
2. ![disable](https://user-images.githubusercontent.com/49511/33676295-a3732b32-da72-11e7-9920-43c8b6d25134.png) or ![remove](https://user-images.githubusercontent.com/49511/33676296-a38aa708-da72-11e7-9c15-7960d17422b7.png) Lockbox

## If I delete Lockbox, what happens to the entries I’ve saved?

The alpha version of Lockbox doesn’t offer backup or synchronization. You’ll need to re-add login information to Lockbox after installing it again.

## What if I forget my Firefox Account password?

Firefox Accounts do not offer password recovery functionality. If you added a Firefox Account to Lockbox and forget your password, you’ll need to reset your Firefox Account. Note that you’ll lose all saved Lockbox entries.

## Will Lockbox work with other password managers?

The alpha version of Lockbox hasn’t been tested widely with other password managers. We recommend disabling or deleting other password managers from Firefox before installing Lockbox.

## Do Lockbox entries sync to other computers with Lockbox installed?

Yes, if you secure Lockbox with a Firefox Account.

## Can I try Lockbox if I don’t have a Mozilla.com email address?

Sure. To get started, click the <a href="https://testpilot.firefox.com/files/lockbox@mozilla.com/latest">Install Lockbox</a> button on the Introduction page. Note that this is an alpha version. Features and functionality will change as we continue developing Lockbox.

## If I already have a Firefox Account, can I create a separate Firefox Account to use only with Lockbox? 

You can create a new account using a different email address than the one you use for your existing Firefox Account. Note that the new Firefox Account won’t sync bookmarks, history and open tabs unless you use it to sign into the browser.
