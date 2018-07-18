/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs");
const path = require("path");

function statPromise(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      err ? reject(err) : resolve(stat);
    });
  });
}

module.exports = class DirListWebpackPlugin {
  constructor(options) {
    this.options = {
      directory: undefined,
      filename: undefined,
      filter: undefined,
      compareFunction: undefined,
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

      const directory = path.resolve(compiler.context, this.options.directory);
      fs.readdir(directory, (err, files) => {
        if (err) {
          compilation.errors.push(`DirListWebpackPlugin couldn't read ` +
                                  `directory ${this.options.directory}`);
          callback();
          return;
        }

        let filesPromise;
        if (this.options.filter) {
          filesPromise = Promise.all(files.map((f) => {
            const filename = path.join(directory, f);
            return statPromise(filename).then(
              (stats) => this.options.filter(f, stats),
              () => {
                compilation.errors.push(`DirListWebpackPlugin couldn't stat ` +
                                        `directory ${filename}`);
                callback();
              }
            );
          })).then((filtered) => {
            return files.filter((_, i) => filtered[i]);
          });
        } else {
          filesPromise = Promise.resolve(files);
        }

        filesPromise.then((files) => {
          if (this.options.compareFunction) {
            files.sort(this.options.compareFunction);
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
    });
  }
};
