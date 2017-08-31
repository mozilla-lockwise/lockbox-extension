/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import webpack from "webpack";
import combineLoaders from "webpack-combine-loaders";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

const entries = {
  "background": "./webextension/background/index.js",
  "manage/index": "./webextension/manage/index.js"
};

const NODE_ENV = (process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() :
                 "development";

export default {
  context: path.join(__dirname, "/src"),
  entry: entries,
  devtool: "cheap-module-source-map",

  output: {
    filename: "./webextension/[name].js",
    path: path.join(__dirname, "/dist"),
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: combineLoaders([{
        loader: "style-loader"
      }, {
        loader: "css-loader",
        query: {
          modules: true,
          localIdentName: "[name]__[local]___[hash:base64:5]"
        }
      }])
    }]
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
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(NODE_ENV),
      },
    }),
  ],
};
