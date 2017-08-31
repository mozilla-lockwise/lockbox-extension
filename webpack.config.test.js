/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const combineLoaders = require("webpack-combine-loaders");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

const config = {
  target: "node",
  externals: [nodeExternals()],
  devtool: "cheap-module-source-map",

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      options: {
        presets: ["react", "stage-2"],
        plugins: ["istanbul", "transform-runtime"]
      }
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
  }
};
module.exports = config;
