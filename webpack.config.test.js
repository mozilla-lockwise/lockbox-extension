/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import path from "path";
import webpack from "webpack";
import combineLoaders from "webpack-combine-loaders";

export default {
  devtool: "inline-source-map",

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      // this has to change to "use:" for webpack 4
      loader: "babel-loader",
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      // I think this is broken though
      loader: combineLoaders([{
        loader: "style-loader",
      }, {
        loader: "css-loader",
        query: {
          modules: true,
          camelCase: "dashes",
          importLoaders: 1,
          localIdentName: "[name]__[local]___[hash:base64:5]",
        },
      }]),
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("test"),
      },
    }),
  ],

  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      test: path.resolve(__dirname, "test", "unit"),
    },
  },
};
