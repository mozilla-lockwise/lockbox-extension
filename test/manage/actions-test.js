/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect } from "chai";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import "test/mocks/browser";
import { initialState } from "./mock-redux-state";
import * as actions from "src/webextension/manage/actions";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("manage > actions", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    browser.runtime.onMessage.mockClearListener();
  });

  it("listItems() dispatched", async() => {
    const items = [
      {id: "1", title: "title 1"},
      {id: "2", title: "title 2"},
    ];
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.type === "list_items") {
        return {items};
      }
      return null;
    });

    await store.dispatch(actions.listItems());
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      { type: actions.LIST_ITEMS_STARTING,
        actionId: dispatched[0].actionId },
      { type: actions.LIST_ITEMS_COMPLETED,
        actionId: dispatched[0].actionId,
        items },
    ]);
  });

  it("addItem() dispatched", async() => {
    const item = {
      title: "title",
      entry: {
        kind: "login",
        username: "username",
        password: "password",
      },
    };
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.type === "add_item") {
        return {item: {...item, id: "1"}};
      }
      return null;
    });

    await store.dispatch(actions.addItem(item));
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      { type: actions.ADD_ITEM_STARTING,
        actionId: dispatched[0].actionId,
        item },
      { type: actions.ADD_ITEM_COMPLETED,
        actionId: dispatched[0].actionId,
        item: {...item, id: "1"} },
    ]);
  });

  it("updateItem() dispatched", async() => {
    const item = {
      id: "1",
      title: "title",
      entry: {
        kind: "login",
        username: "username",
        password: "password",
      },
    };
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.type === "update_item") {
        return {item};
      }
      return null;
    });

    await store.dispatch(actions.updateItem(item));
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      { type: actions.UPDATE_ITEM_STARTING,
        actionId: dispatched[0].actionId,
        item },
      { type: actions.UPDATE_ITEM_COMPLETED,
        actionId: dispatched[0].actionId,
        item },
    ]);
  });

  it("removeItem() dispatched", async() => {
    const id = "1";
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.type === "remove_item") {
        return {};
      }
      return null;
    });

    await store.dispatch(actions.removeItem(id));
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      { type: actions.REMOVE_ITEM_STARTING,
        actionId: dispatched[0].actionId,
        id },
      { type: actions.REMOVE_ITEM_COMPLETED,
        actionId: dispatched[0].actionId,
        id },
    ]);
  });

  it("selectItem() dispatched", async() => {
    const item = {
      id: "1",
      title: "title",
      entry: {
        kind: "login",
        username: "username",
        password: "password",
      },
    };
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.type === "get_item") {
        return {item};
      }
      return null;
    });

    await store.dispatch(actions.selectItem(item.id));
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      { type: actions.SELECT_ITEM_STARTING,
        actionId: dispatched[0].actionId,
        id: item.id },
      { type: actions.SELECT_ITEM_COMPLETED,
        actionId: dispatched[0].actionId,
        item },
    ]);
  });

  it("selectItem(null) dispatched", async() => {
    await store.dispatch(actions.selectItem(null));
    const dispatched = store.getActions();
    expect(dispatched).to.deep.equal([
      { type: actions.SELECT_ITEM_STARTING,
        actionId: dispatched[0].actionId,
        id: null },
      { type: actions.SELECT_ITEM_COMPLETED,
        actionId: dispatched[0].actionId,
        item: null },
    ]);
  });

  it("addedItem() dispatched", () => {
    const item = {
      id: "1",
      title: "title",
      entry: {
        kind: "login",
        username: "username",
        password: "password",
      },
    };

    store.dispatch(actions.addedItem(item));
    expect(store.getActions()).to.deep.equal([
      { type: actions.ADD_ITEM_COMPLETED,
        actionId: undefined,
        item },
    ]);
  });

  it("updatedItem() dispatched", () => {
    const item = {
      id: "1",
      title: "title",
      entry: {
        kind: "login",
        username: "username",
        password: "password",
      },
    };

    store.dispatch(actions.updatedItem(item));
    expect(store.getActions()).to.deep.equal([
      { type: actions.UPDATE_ITEM_COMPLETED,
        actionId: undefined,
        item },
    ]);
  });

  it("removedItem() dispatched", () => {
    const id = "1";

    store.dispatch(actions.removedItem(id));
    expect(store.getActions()).to.deep.equal([
      { type: actions.REMOVE_ITEM_COMPLETED,
        actionId: undefined,
        id },
    ]);
  });

  it("startNewItem() dispatched", () => {
    store.dispatch(actions.startNewItem());
    expect(store.getActions()).to.deep.equal([
      { type: actions.START_NEW_ITEM },
    ]);
  });

  it("editCurrentItem() dispatched", () => {
    store.dispatch(actions.editCurrentItem());
    expect(store.getActions()).to.deep.equal([
      { type: actions.EDIT_CURRENT_ITEM },
    ]);
  });

  it("cancelEditing() dispatched", () => {
    store.dispatch(actions.cancelEditing());
    expect(store.getActions()).to.deep.equal([
      { type: actions.CANCEL_EDITING },
    ]);
  });

  it("filterItems() dispatched", () => {
    store.dispatch(actions.filterItems("my filter"));
    expect(store.getActions()).to.deep.equal([
      { type: actions.FILTER_ITEMS,
        filter: "my filter" },
    ]);
  });

  it("showModal() dispatched", () => {
    store.dispatch(actions.showModal("my_modal", {prop: "value"}));
    expect(store.getActions()).to.deep.equal([
      { type: actions.SHOW_MODAL,
        id: "my_modal",
        props: {prop: "value"} },
    ]);
  });

  it("hideModal() dispatched", () => {
    store.dispatch(actions.hideModal())
    expect(store.getActions()).to.deep.equal([
      { type: actions.HIDE_MODAL },
    ]);
  });
});
