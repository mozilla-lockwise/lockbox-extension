/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import path from "path";
import webpack from "webpack";

export default {
  mode: "development",
  devtool: "inline-source-map",

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader",
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        "style-loader",
        { loader: "css-loader",
          options: {
            modules: true,
            camelCase: "dashes",
            importLoaders: 1,
            localIdentName: "[name]__[local]___[hash:base64:5]",
          },
        },
      ],
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
