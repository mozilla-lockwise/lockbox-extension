/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-register")();

module.exports = function(config) {
  config.set({
    browsers: ["FirefoxHeadless"],
    customLaunchers: {
      FirefoxHeadless: {
        base: "Firefox",
        flags: ["-headless"],
      },
    },

    basePath: "",
    files: [
      "test/**/*-test.js",
    ],
    exclude: [],
    preprocessors: {
      "test/**/*-test.js": ["webpack", "sourcemap"],
    },

    frameworks: ["mocha"],
    reporters: ["mocha", "coverage-istanbul", "coverage"],

    webpack: require("./webpack.config.test.js").default,
    webpackMiddleware: {
      stats: "errors-only",
    },

    coverageReporter: {
      type: "lcov",
      dir: "coverage/",
    },

    coverageIstanbulReporter: {
      reports: ["html", "text"],
      dir: "coverage/firefox",
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: false,
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,
  })
};
