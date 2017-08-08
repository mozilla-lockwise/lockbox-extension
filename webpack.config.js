const CopyWebpackPlugin = require("copy-webpack-plugin");

var path = require("path");

var entries = {
  "background": "./webextension/background.js",
  "manage/index": "./webextension/manage/index.js"
};

var config = {
  context: path.join(__dirname, "/src"),
  entry: entries,

  output: {
    filename: "./webextension/[name].js",
    path: path.join(__dirname, "/dist"),
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["react"]
        }
      }
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: "bootstrap.js"},
      {from: "chrome.manifest"},
      {from: "install.rdf"},
      {from: "webextension/manifest.json", to: "webextension/"},
      {from: "webextension/**/*.ftl"},
      {from: "webextension/**/*.html"},
      {from: "webextension/icons/*"},
    ]),
  ],
};
module.exports = config;
