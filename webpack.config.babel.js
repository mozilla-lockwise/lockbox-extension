/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import webpack from "webpack";
import combineLoaders from "webpack-combine-loaders";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MinifyPlugin from "babel-minify-webpack-plugin";
import path from "path";

const entries = {
  "webextension/background": "./webextension/background/index.js",
  "webextension/manage/index": "./webextension/manage/index.js"
};

const NODE_ENV = (process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() :
                 "development";

const cssLoader = {
  loader: "css-loader",
  query: {
    modules: true,
    camelCase: "dashes",
    importLoaders: 1,
    localIdentName: "[name]__[local]___[hash:base64:5]",
  }
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
      use: combineLoaders([cssLoader])
    })
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
    ])
  });

}

export default {
  context: path.join(__dirname, "/src"),
  entry: entries,
  devtool: "cheap-module-source-map",

  output: {
    filename: "[name].js",
    path: path.join(__dirname, "/dist"),
    publicPath: "",
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      ...extraLoaders
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: "bootstrap.js"},
      {from: "chrome.manifest"},
      {from: "install.rdf"},
      {from: "webextension/manifest.json", to: "webextension/"},
      {from: "webextension/**/*.ftl"},
      {from: "webextension/icons/*"},
    ]),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(NODE_ENV),
      },
    }),
    new HtmlWebpackPlugin({
      title: "Lockbox",
      inject: false,
      minify: htmlMinifyOptions,
      template: "template.ejs",
      chunks: ["webextension/manage/index"],
      filename: "webextension/manage/index.html",
      icon: "../icons/lock.png"
    }),
    ...extraPlugins
  ],
};
