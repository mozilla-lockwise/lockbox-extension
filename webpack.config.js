var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require("path");

var config = {
  context: path.join(__dirname, "/src"),
  entry: "./webextension/manage.js",

  output: {
    filename: "./webextension/manage.js",
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
    ], {ignore: [
      "webextension/manage.js"
    ]}),
  ],
};
module.exports = config;
