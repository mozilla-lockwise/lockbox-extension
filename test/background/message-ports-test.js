/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import openDataStore from "../../src/webextension/background/datastore";
import initializeMessagePorts from
       "../../src/webextension/background/message-ports";

describe("message ports (background side)", () => {
  let itemId, selfMessagePort, otherMessagePort, selfListener, otherListener;

  before(async() => {
    await openDataStore().then(async(ds) => ds.initialize());
    initializeMessagePorts();

    selfMessagePort = browser.runtime.connect();
    otherMessagePort = browser.runtime.connect(undefined, {mockPrimary: false});
  });

  beforeEach(() => {
    selfMessagePort.onMessage.addListener(selfListener = sinon.spy());
    otherMessagePort.onMessage.addListener(otherListener = sinon.spy());
  });

  afterEach(() => {
    selfMessagePort.onMessage.mockClearListener();
    otherMessagePort.onMessage.mockClearListener();
  });

  after(() => {
    // Clear the listeners set in <src/webextension/background/messagePorts.js>.
    browser.runtime.onConnect.mockClearListener();
    browser.runtime.onMessage.mockClearListener();
  });

  it('handle "add_item"', async() => {
    const item = {
      title: "title",
      entry: {
        kind: "login",
        username: "username",
        password: "password",
      },
    };
    const result = await browser.runtime.sendMessage({
      type: "add_item",
      item,
    });
    itemId = result.item.id;

    expect(result.item).to.deep.include(item);
    expect(selfListener).to.have.callCount(0);
    expect(otherListener).to.have.callCount(1);
    expect(otherListener.args[0][0].type).to.equal("added_item");
    expect(otherListener.args[0][0].item).to.deep.include(item);
  });

  it('handle "update_item"', async() => {
    const item = {
      title: "updated title",
      id: itemId,
      entry: {
        kind: "login",
        username: "updated username",
        password: "updated password",
      },
    };
    const result = await browser.runtime.sendMessage({
      type: "update_item",
      item,
    });

    expect(result.item).to.deep.include(item);
    expect(selfListener).to.have.callCount(0);
    expect(otherListener).to.have.callCount(1);
    expect(otherListener.args[0][0].type).to.equal("updated_item");
    expect(otherListener.args[0][0].item).to.deep.include(item);
  });

  it('handle "get_item"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "get_item",
      id: itemId,
    });

    expect(result.item).to.deep.include({
      title: "updated title",
      entry: {
        kind: "login",
        username: "updated username",
        password: "updated password",
      },
    });
  });

  it('handle "list_items"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "list_items",
    });

    expect(result).to.deep.equal({items: [{
      id: itemId,
      title: "updated title",
      username: "updated username",
    }]});
  });

  it('handle "remove_item"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "remove_item",
      id: itemId,
    });

    expect(result).to.deep.equal({});
    expect(selfListener).to.have.callCount(0);
    expect(otherListener).to.have.callCount(1);
    expect(otherListener).to.be.calledWith({
      type: "removed_item",
      id: itemId,
    });
  });

  it("handle unknown message type", async() => {
    await expect(browser.runtime.sendMessage({
      type: "nonexist",
    })).to.be.rejectedWith(Error);
  });

  it("handle message port disconnect", async() => {
    otherMessagePort.disconnect();

    // Make sure no message is broadcast now that we've disconnected.
    const item = {
      title: "title",
      entry: {
        kind: "login",
        username: "username",
        password: "password",
      },
    };
    await browser.runtime.sendMessage({
      type: "add_item",
      item,
    });
    expect(otherListener).to.have.callCount(0);
  });
});
