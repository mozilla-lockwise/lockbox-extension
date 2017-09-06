/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-register")();

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { document } = (new JSDOM("")).window;

var exposedProperties = ["window", "navigator", "document", "browser",
                         "HTMLElement"];

global.document = document;
global.window = document.defaultView;

// This is necessary for chai's .include() to work due to its dependency on
// `type-detect`. See <https://github.com/chaijs/type-detect/issues/98>.
global.HTMLElement = global.window.HTMLElement;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: "node.js"
};

global.browser = {
  runtime: {
    sendMessage: async function(msg) {
      return {};
    }
  }
};
