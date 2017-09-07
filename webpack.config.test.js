/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import combineLoaders from "webpack-combine-loaders";
import nodeExternals from "webpack-node-externals";
import path from "path";

export default {
  target: "node",
  externals: [nodeExternals()],
  devtool: "cheap-module-source-map",

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
          camelCase: "dashes",
          importLoaders: 1,
          localIdentName: "[name]__[local]___[hash:base64:5]",
        }
      }])
    }]
  }
};
