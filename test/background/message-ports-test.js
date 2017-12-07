/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import fetchMock from "fetch-mock";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import waitUntil from "async-wait-until";

import "test/mocks/browser";
import openDataStore from "src/webextension/background/datastore";
import initializeMessagePorts from "src/webextension/background/message-ports";

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe("background > message ports", () => {
  let itemId, selfMessagePort, otherMessagePort, selfListener, otherListener;
  let addonPort;

  before(async () => {
    await openDataStore();
    // capture connect from message-ports
    browser.runtime.onConnect.addListener((port) => {
      addonPort = port;
      browser.runtime.onConnect.mockClearListener();
    });
    initializeMessagePorts();

    selfMessagePort = browser.runtime.connect();
    otherMessagePort = browser.runtime.connect(undefined, {mockPrimary: false});

    // setup fake OAuth response
    fetchMock.post("end:/v1/token", {
      status: 200,
      body: {
        grant_type: "bearer",
        access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
        expires_in: 1209600,
        auth_at: 1510734551,
        refresh_token: "rmrBzLYi2zia4ExNBy7uXE4s_Da_HMS4d3tvr203OVTq1EMQqh-85m4Hejo3TKBKuont6QFIlLJ23rZR4xqZBA",
      },
    });
    fetchMock.get("end:/v1/profile", {
      status: 200,
      body: {
        uid: "1234",
        email: "eripley@wyutani.com",
      },
    });
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
  describe("from addon", () => {
    let openView;

    beforeEach(() => {
      openView = sinon.spy();
      initializeMessagePorts.__Rewire__("openView", openView);
    });
    afterEach(() => {
      initializeMessagePorts.__ResetDependency__("openView");
    });

    it('handle (from addon) "extension_installed"', () => {
      addonPort.postMessage({
        type: "extension_installed",
      });

      expect(openView).to.have.callCount(1);
    });

    it('handle (from addon) "extension_upgraded"', async () => {
      addonPort.postMessage({
        type: "extension_upgraded",
        oldVersion: "0.1.1",
        version: "0.1.2",
      });

      await waitUntil(() => openView.callCount === 1);
      expect(openView).to.have.callCount(1);
    });
  });

  it('handle "get_account_details"', async () => {
    const result = await browser.runtime.sendMessage({
      type: "get_account_details",
    });

    expect(result).to.deep.equal({
      account: {
        mode: "guest",
        uid: undefined,
        email: undefined,
      },
    });
  });

  it('handle "open_view"', async () => {
    const result = await browser.runtime.sendMessage({
      type: "open_view",
      name: "firstrun",
    });

    expect(result).to.deep.equal({});
  });

  it('handle "close_view"', async () => {
    const result = await browser.runtime.sendMessage({
      type: "close_view",
      name: "firstrun",
    });

    expect(result).to.deep.equal({});
  });

  it('handle "initialize"', async () => {
    const result = await browser.runtime.sendMessage({
      type: "initialize",
    });

    expect(result).to.deep.equal({});
  });
  it('handle "upgrade_account"', async () => {
    const result = await browser.runtime.sendMessage({
      type: "upgrade_account",
    });

    expect(result).to.deep.equal({});
  });

  it('handle "signout"', async () => {
    const result = await browser.runtime.sendMessage({
      type: "signout",
    });

    expect(result).to.deep.equal({});
  });

  it('handle "signin"', async () => {
    const result = await browser.runtime.sendMessage({
      type: "signin",
    });

    expect(result).to.deep.equal({});
  });

  it('handle "add_item"', async () => {
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

  it('handle "update_item"', async () => {
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

  it('handle "get_item"', async () => {
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

  it('handle "list_items"', async () => {
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

  it('handle "remove_item"', async () => {
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

  it('handle "proxy_telemetry_event"', async () => {
    const recordEvent = sinon.stub().resolves({});
    initializeMessagePorts.__Rewire__("telemetry", {recordEvent});
    const result = await browser.runtime.sendMessage({
      type: "proxy_telemetry_event",
      method: "method",
      object: "object",
      extra: {extra: "value"},
    });
    initializeMessagePorts.__ResetDependency__("telemetry");

    expect(result).to.deep.equal({});
    expect(recordEvent).to.have.been.calledWith("method", "object",
                                                {extra: "value"});
  });

  it("handle unknown message type", async () => {
    const result = await browser.runtime.sendMessage({
      type: "nonexist",
    });
    expect(result).to.equal(null);
  });

  it("handle message port disconnect", async () => {
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

  // this test has to be last, or all the message-ports tests after it FAIL.
  // Eventually better isolation or startup/teardown may be done
  it('handle "reset"', async () => {
    const result = await browser.runtime.sendMessage({
      type: "reset",
    });

    expect(result).to.deep.equal({});
  });
});
