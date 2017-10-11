/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import fetchMock from "fetch-mock";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import configs from "../../src/webextension/background/authorization/configs";
import openDataStore from "../../src/webextension/background/datastore";
import initializeMessagePorts from
       "../../src/webextension/background/message-ports";

describe("background > message ports", () => {
  const email = "eripley@wyutani.com";
  const password = "n0str0m0";

  let itemId, selfMessagePort, otherMessagePort, selfListener, otherListener;

  before(async() => {
    await openDataStore();
    initializeMessagePorts();

    selfMessagePort = browser.runtime.connect();
    otherMessagePort = browser.runtime.connect(undefined, {mockPrimary: false});

    const config = configs["dev-latest"];
    fetchMock.post(`${config.oauth_uri}/token`, JSON.stringify({
      auth_at: 0,
      expires_in: 0,
    }));
    fetchMock.get(`${config.profile_uri}/profile`, "{}");
    fetchMock.post(`${config.fxa_auth_uri}/account/login`, "{}");
  });

  after(() => {
    // Clear the listeners set in <src/webextension/background/messagePorts.js>.
    browser.runtime.onConnect.mockClearListener();
    browser.runtime.onMessage.mockClearListener();

    fetchMock.restore();
  });

  beforeEach(() => {
    selfMessagePort.onMessage.addListener(selfListener = sinon.spy());
    otherMessagePort.onMessage.addListener(otherListener = sinon.spy());
  });

  afterEach(() => {
    selfMessagePort.onMessage.mockClearListener();
    otherMessagePort.onMessage.mockClearListener();
  });

  // Note: these tests are in a specific order since we modify the datastore as
  // we test. Each test assumes the previous has passed.

  it('handle "open_view"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "open_view",
      name: "firstrun",
    });

    expect(result).to.deep.equal({});
  });

  it('handle "close_view"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "close_view",
      name: "firstrun",
    });

    expect(result).to.deep.equal({});
  });

  it('handle "signin"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "signin", interactive: true,
    });

    expect(result).to.deep.equal({
      access: {
        validFrom: new Date(0).toISOString(),
        validUntil: new Date(0).toISOString(),
      },
    });
  });

  it('handle "initialize"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "initialize", email, password,
    });

    expect(result).to.deep.equal({});
  });

  it('handle "lock"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "lock",
    });

    expect(result).to.deep.equal({});
  });

  it('handle "unlock"', async() => {
    const result = await browser.runtime.sendMessage({
      type: "unlock", password,
    });

    expect(result).to.deep.equal({});
  });

  it('handle "add_item"', async() => {
    const item = {
      title: "title",
      origins: ["origin.com"],
      entry: {
        kind: "login",
        username: "username",
        password: "password",
        notes: "notes",
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
      origins: ["updated-origin.com"],
      entry: {
        kind: "login",
        username: "updated username",
        password: "updated password",
        notes: "updated notes",
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
      origins: ["updated-origin.com"],
      entry: {
        kind: "login",
        username: "updated username",
        password: "updated password",
        notes: "updated notes",
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
      origins: ["updated-origin.com"],
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

  it('handle "proxy_telemetry_event"', async() => {
    const recordEvent = sinon.stub().resolves({});
    initializeMessagePorts.__Rewire__("telemetry", {recordEvent});
    const result = await browser.runtime.sendMessage({
      type: "proxy_telemetry_event",
      category: "category",
      method: "method",
      object: "object",
      extra: {extra: "value"},
    });
    initializeMessagePorts.__ResetDependency__("telemetry");

    expect(result).to.deep.equal({});
    expect(recordEvent).to.have.been.calledWith("category", "method", "object",
                                                {extra: "value"});
  });

  it("handle unknown message type", async() => {
    const result = await browser.runtime.sendMessage({
      type: "nonexist",
    });
    expect(result).to.equal(null);
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
