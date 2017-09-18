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
    "plugin:mozilla/recommended",
    "plugin:react/recommended",
  ],
  "env": {
    "browser": true,
    "node": true,
    "webextensions": true,
    "es6": true,
  },
  "plugins": [
    "mozilla",
    "react",
    ...extraPlugins,
  ],
  "rules": {
    "comma-dangle": ["error", "always-multiline"],
    "curly": "error",
    "no-console": "warn",
  },
}
