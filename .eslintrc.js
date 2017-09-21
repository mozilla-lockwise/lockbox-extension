let extraPlugins = [];
if (process.env.STRICT_LINT !== "1") {
  extraPlugins.push("only-warn");
}

module.exports = {
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true,
    },
  },
  "extends": [
    "eslint:recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:mozilla/recommended",
    "plugin:react/recommended",
  ],
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "webextensions": true,
  },
  "plugins": [
    "jsx-a11y",
    "mozilla",
    "react",
    ...extraPlugins,
  ],
  "rules": {
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",

    "comma-dangle": ["error", "always-multiline"],
    "curly": "error",
    "no-console": "warn",
  },
}
