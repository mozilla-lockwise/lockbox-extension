{
  "manifest_version": 2,
  "name": "{{name}}",
  "version": "{{version}}",

  "description": "{{description}}",

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
