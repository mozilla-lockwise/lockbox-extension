/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs");
const path = require("path");
const renderObject = require("json-templater/object");

module.exports = class JSONWebpackPlugin {
  constructor(options) {
    this.options = {
      template: undefined,
      filename: undefined,
      data: {},
      ...options,
    };
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      if (!this.options.template) {
        compilation.errors.push("JSONWebpackPlugin template undefined");
        callback();
        return;
      }
      if (!this.options.filename) {
        compilation.errors.push("JSONWebpackPlugin filename undefined");
        callback();
        return;
      }

      const template = path.resolve(compiler.context, this.options.template);
      fs.readFile(template, {encoding: "utf8"}, (err, data) => {
        if (err) {
          compilation.errors.push("JSONWebpackPlugin couldn't read template");
          callback();
          return;
        }

        const rendered = renderObject(data, this.options.data);
        compilation.assets[this.options.filename] = {
          source() {
            return rendered;
          },
          size() {
            return rendered.length;
          },
        };
        callback();
      });
    });
  }
};
