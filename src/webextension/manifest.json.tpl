{
  "manifest_version": 2,
  "name": "{{name}}",
  "version": "{{version}}",

  "description": "{{description}}",

  "applications": {
    "gecko": {
      "id": "lockbox@mozilla.com",
      "update_url": "https://raw.githubusercontent.com/mozilla-lockbox/lockbox-extension/master/updates.json"
    }
  },

  "background": {
    "scripts": ["background.js"]
  },

  "browser_action": {
    "browser_style": true,
    "default_icon": {
      "512": "icons/lock.png"
    },
    "default_title": "Lockbox"
  },

  "commands": {
    "_execute_browser_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+L"
      }
    }
  }
}
