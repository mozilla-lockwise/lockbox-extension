/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import path from "path";
import webpack from "webpack";
import combineLoaders from "webpack-combine-loaders";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import MinifyPlugin from "babel-minify-webpack-plugin";

import DirListWebpackPlugin from "./dir-list-webpack-plugin";
import JSONWebpackPlugin from "./json-webpack-plugin";
import thisPackage from "./package.json";

const NODE_ENV = (() => {
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV.toLowerCase();
  } else if (process.env.NODE_SUGGESTED_ENV) {
    return process.env.NODE_SUGGESTED_ENV.toLowerCase();
  }
  return "development";
})();

// Enable the doorhanger by default on dev builds.
const ENABLE_DOORHANGER = (
  process.env.ENABLE_DOORHANGER ?
    Boolean(parseInt(process.env.ENABLE_DOORHANGER)) :
    NODE_ENV !== "production"
);

const cssLoader = {
  loader: "css-loader",
  query: {
    modules: true,
    camelCase: "dashes",
    importLoaders: 1,
    localIdentName: "[name]__[local]___[hash:base64:5]",
  },
};

let extraPlugins = [];
let extraLoaders = [];
let extraCopy = [];
let htmlMinifyOptions = false;
if (NODE_ENV === "production") {

  extraPlugins.push(
    new MinifyPlugin({mangle: false}),
    new ExtractTextPlugin("[name].css"),
  );

  extraLoaders.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: combineLoaders([cssLoader]),
    }),
  });

  extraCopy.push({from: "webextension/locales/locales.json",
                  to: "webextension/locales/"});

  htmlMinifyOptions = {
    removeComments: true,
    collapseWhitespace: true,
  };

} else {

  extraPlugins.push(
    new DirListWebpackPlugin({
      directory: "webextension/locales",
      filename: "webextension/locales/locales.json",
      filter(file, stats) {
        return file.charAt(0) !== "." && stats.isDirectory();
      },
      compareFunction(a, b) {
        // Ensure en-US goes first, since it's the default.
        const pre = (s) => s === "en-US" ? s : "z" + s;
        return pre(a).localeCompare(pre(b));
      },
    }),
  );

  extraLoaders.push({
    test: /\.css$/,
    exclude: /node_modules/,
    loader: combineLoaders([
      {loader: "style-loader"},
      cssLoader,
    ]),
  });

}

export default {
  context: path.join(__dirname, "src"),
  devtool: "cheap-module-source-map",

  entry: {
    "webextension/background": "./webextension/background/index.js",
    "webextension/list/manage/index": "./webextension/list/manage/index.js",
    "webextension/list/popup/index": "./webextension/list/popup/index.js",
    "webextension/firstrun/index": "./webextension/firstrun/index.js",
    "webextension/unlock/index": "./webextension/unlock/index.js",
    "webextension/settings/index": "./webextension/settings/index.js",
  },

  output: {
    filename: "[name].js",
    path: path.join(__dirname, "/dist"),
    publicPath: "",
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
    }, ...extraLoaders],
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: "bootstrap.js"},
      {from: "icon.png"},
      {from: "webextension/fonts/*"},
      {from: "webextension/icons/*"},
      {from: "webextension/images/*"},
      {from: "webextension/locales/**/*.ftl"},
      ...extraCopy,
    ]),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(NODE_ENV),
        "ENABLE_DOORHANGER": JSON.stringify(ENABLE_DOORHANGER),
      },
    }),
    new HTMLWebpackPlugin({
      template: "template.ejs",
      filename: "webextension/firstrun/index.html",
      chunks: ["webextension/firstrun/index"],
      inject: false,
      minify: htmlMinifyOptions,
      icon: "/icons/lb_locked.svg",
    }),
    new HTMLWebpackPlugin({
      template: "template.ejs",
      filename: "webextension/list/manage/index.html",
      chunks: ["webextension/list/manage/index"],
      inject: false,
      minify: htmlMinifyOptions,
      icon: "/icons/lb_unlocked.svg",
    }),
    new HTMLWebpackPlugin({
      template: "template.ejs",
      filename: "webextension/list/popup/index.html",
      chunks: ["webextension/list/popup/index"],
      inject: false,
      minify: htmlMinifyOptions,
    }),
    new HTMLWebpackPlugin({
      template: "template.ejs",
      filename: "webextension/unlock/index.html",
      chunks: ["webextension/unlock/index"],
      inject: false,
      minify: htmlMinifyOptions,
    }),
    new HTMLWebpackPlugin({
      template: "template.ejs",
      filename: "webextension/settings/index.html",
      chunks: ["webextension/settings/index"],
      inject: false,
      minify: htmlMinifyOptions,
    }),
    new HTMLWebpackPlugin({
      template: "install.rdf.ejs",
      filename: "install.rdf",
      inject: false,
      package: thisPackage,
    }),
    new JSONWebpackPlugin({
      template: "webextension/manifest.json.tpl",
      filename: "webextension/manifest.json",
      data: thisPackage,
    }),
    ...extraPlugins,
  ],
};
