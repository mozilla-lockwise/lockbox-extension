var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require("path");

var entries = {
  background: "./webextension/background.js",
  manage: "./webextension/manage.js"
};

var ignoreOnCopy = [];
ignoreOnCopy = ignoreOnCopy.concat(
  Object.keys(entries).map(n => entries[n].replace(/^\.+\//, ""))
);

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
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: "**/*"},
    ], {ignore: ignoreOnCopy}),
  ],
};
module.exports = config;
