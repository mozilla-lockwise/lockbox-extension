/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import fs from "fs";

export default class DirListWebpackPlugin {
  constructor(options) {
    this.options = {
      directory: undefined,
      filename: undefined,
      includeDotfiles: false,
      ...options,
    };
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      if (!this.options.directory) {
        compilation.errors.push("DirListWebpackPlugin directory undefined");
        callback();
        return;
      }
      if (!this.options.filename) {
        compilation.errors.push("DirListWebpackPlugin filename undefined");
        callback();
        return;
      }

      fs.readdir(this.options.directory, (err, files) => {
        if (err) {
          compilation.errors.push(`DirListWebpackPlugin couldn't read ` +
                                  `directory $(this.options.directory)`);
          callback();
          return;
        }

        if (!this.options.includeDotfiles) {
          files = files.filter((x) => x.charAt(0) !== ".");
        }

        const output = JSON.stringify(files);
        compilation.assets[this.options.filename] = {
          source() {
            return output;
          },
          size() {
            return output.length;
          },
        };
        callback();
      });
    });
  }
}
