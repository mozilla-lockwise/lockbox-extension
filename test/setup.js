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
  userAgent: "node.js",
};

// Mock the WebExtension message ports so that our tests can pretend to talk
// between the front- and back-end.

class MockListener {
  constructor() {
    this.mockClearListener();
  }

  addListener(fn) {
    if (this._listener) {
      // eslint-disable-next-line no-console
      console.warn("Warning: only one listener supported; did you forget to " +
                   "call mockClearListener()?");
    }
    this._listener = fn;
  }

  mockClearListener() {
    this._listener = null;
  }

  mockFireListener(...args) {
    if (this._listener) {
      return this._listener(...args);
    }
    return null;
  }
}

let nextContextId = 1;
class MockMessageSender {
  constructor(contextId) {
    this.contextId = contextId === undefined ? nextContextId++ : contextId;
  }
}

// This is the message sender that matches the real sender's context most
// closely. It's useful for correlating connectionless messages with
// connection-based messages. Call browser.connect() to create the primary
// connection-based message port or browser.connect(..., {mockPrimary: false})
// to create a secondary one.
const primaryContextId = 0;
const primaryMessageSender = new MockMessageSender(primaryContextId);

class MockPort {
  constructor(sender) {
    this._otherPort = null;
    this.onMessage = new MockListener();
    this.onDisconnect = new MockListener();
    if (sender) {
      this.sender = sender;
    }
  }

  postMessage(msg) {
    this._otherPort.onMessage.mockFireListener(msg);
  }

  disconnect() {
    this._otherPort.onDisconnect.mockFireListener();
  }
}

function makePairedPorts(contextId) {
  const left = new MockPort();
  const right = new MockPort(new MockMessageSender(contextId));
  left._otherPort = right;
  right._otherPort = left;
  return [left, right];
}

global.browser = {
  runtime: {
    onMessage: new MockListener(),
    onConnect: new MockListener(),

    async sendMessage(msg) {
      if (this.onMessage._listener) {
        return await this.onMessage._listener(msg, primaryMessageSender);
      }
      return null;
    },

    connect(extensionId, {mockPrimary = true} = {}) {
      const [left, right] = makePairedPorts(
        mockPrimary ? primaryContextId : undefined
      );
      this.onConnect.mockFireListener(right);
      return left;
    },
  },
};
