/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import path from "path";
import webpack from "webpack";
import combineLoaders from "webpack-combine-loaders";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import XMLWebpackPlugin from "xml-webpack-plugin";
import MinifyPlugin from "babel-minify-webpack-plugin";

import DirListWebpackPlugin from "./dir-list-webpack-plugin";
import JSONWebpackPlugin from "./json-webpack-plugin";
import thisPackage from "./package.json";

const NODE_ENV = (process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() :
                 "development";

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

  htmlMinifyOptions = {
    removeComments: true,
    collapseWhitespace: true,
  };

} else {

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
    "webextension/manage/index": "./webextension/manage/index.js",
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
    }, {
      test: /\.txt$/,
      use: "raw-loader",
    }, ...extraLoaders],
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: "bootstrap.js"},
      {from: "webextension/locales/**/*.ftl"},
      {from: "webextension/icons/*"},
      {from: "webextension/icons/lock.png", to: "icon.png"},
    ], {
      copyUnmodified: true,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(NODE_ENV),
      },
    }),
    new HTMLWebpackPlugin({
      template: "template.ejs",
      filename: "webextension/manage/index.html",
      chunks: ["webextension/manage/index"],
      inject: false,
      minify: htmlMinifyOptions,
      title: "Lockbox",
      icon: "../icons/lock.png",
    }),
    new XMLWebpackPlugin({files: [{
      template: path.join(__dirname, "src/install.rdf.ejs"),
      filename: "install.rdf",
      data: thisPackage,
    }]}),
    new JSONWebpackPlugin({
      template: path.join(__dirname, "src/webextension/manifest.json.tpl"),
      filename: "webextension/manifest.json",
      data: thisPackage,
    }),
    new DirListWebpackPlugin({
      directory: path.join(__dirname, "src/webextension/locales"),
      filename: "webextension/locales/locales.json",
    }),
    ...extraPlugins,
  ],
};
