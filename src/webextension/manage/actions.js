/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const LIST_ITEMS_STARTING = Symbol("LIST_ITEMS_STARTING");
export const LIST_ITEMS_COMPLETED = Symbol("LIST_ITEMS_COMPLETED");

export const ADD_ITEM_STARTING = Symbol("ADD_ITEM_STARTING");
export const ADD_ITEM_COMPLETED = Symbol("ADD_ITEM_COMPLETED");

export const UPDATE_ITEM_STARTING = Symbol("UPDATE_ITEM_STARTING");
export const UPDATE_ITEM_COMPLETED = Symbol("UPDATE_ITEM_COMPLETED");

export const REMOVE_ITEM_STARTING = Symbol("REMOVE_ITEM_STARTING");
export const REMOVE_ITEM_COMPLETED = Symbol("REMOVE_ITEM_COMPLETED");

export const SELECT_ITEM_STARTING = Symbol("SELECT_ITEM_STARTING");
export const SELECT_ITEM_COMPLETED = Symbol("SELECT_ITEM_COMPLETED");

export const START_NEW_ITEM = Symbol("START_NEW_ITEM");
export const CANCEL_NEW_ITEM = Symbol("CANCEL_NEW_ITEM");

// The action ID is used to correlate async actions with each other (i.e.
// FOO_STARTING and FOO_COMPLETED).
let nextActionId = 0;

export function listItems() {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(listItemsStarting(actionId));

    const response = await browser.runtime.sendMessage({
      type: "list_items",
    });
    dispatch(listItemsCompleted(actionId, response.items));
  };
}

function listItemsStarting(actionId) {
  return {
    type: LIST_ITEMS_STARTING,
    actionId,
  };
}

function listItemsCompleted(actionId, items) {
  return {
    type: LIST_ITEMS_COMPLETED,
    actionId,
    items,
  };
}

export function addItem(details) {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(addItemStarting(actionId, details));

    const response = await browser.runtime.sendMessage({
      type: "add_item",
      item: details,
    });
    dispatch(addItemCompleted(actionId, response.item));
  };
}

export function addedItem(item) {
  return addItemCompleted(undefined, item);
}

function addItemStarting(actionId, item) {
  return {
    type: ADD_ITEM_STARTING,
    actionId,
    item,
  };
}

function addItemCompleted(actionId, item) {
  return {
    type: ADD_ITEM_COMPLETED,
    actionId,
    item,
  };
}

export function updateItem(item) {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(updateItemStarting(actionId, item));

    const response = await browser.runtime.sendMessage({
      type: "update_item",
      item,
    });
    dispatch(updateItemCompleted(actionId, response.item));
  };
}

export function updatedItem(item) {
  return updateItemCompleted(undefined, item);
}

function updateItemStarting(actionId, item) {
  return {
    type: UPDATE_ITEM_STARTING,
    actionId,
    item,
  };
}

function updateItemCompleted(actionId, item) {
  return {
    type: UPDATE_ITEM_COMPLETED,
    actionId,
    item,
  };
}

export function removeItem(id) {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(removeItemStarting(actionId, id));

    await browser.runtime.sendMessage({
      type: "remove_item",
      id,
    });
    dispatch(removeItemCompleted(actionId, id));
  };
}

export function removedItem(id) {
  return removeItemCompleted(undefined, id);
}

function removeItemStarting(actionId, id) {
  return {
    type: REMOVE_ITEM_STARTING,
    actionId,
    id,
  };
}

function removeItemCompleted(actionId, id) {
  return {
    type: REMOVE_ITEM_COMPLETED,
    actionId,
    id,
  };
}

export function selectItem(id) {
  return async function(dispatch) {
    const actionId = nextActionId++;
    dispatch(selectItemStarting(actionId, id));
    const response = await browser.runtime.sendMessage({
      type: "get_item",
      id,
    });
    dispatch(selectItemCompleted(actionId, response.item));
  };
}

function selectItemStarting(actionId, id) {
  return {
    type: SELECT_ITEM_STARTING,
    actionId,
    id,
  };
}

function selectItemCompleted(actionId, item) {
  return {
    type: SELECT_ITEM_COMPLETED,
    actionId,
    item,
  };
}

export function startNewItem() {
  return {
    type: START_NEW_ITEM,
  };
}

export function cancelNewItem() {
  return {
    type: CANCEL_NEW_ITEM,
  };
}
