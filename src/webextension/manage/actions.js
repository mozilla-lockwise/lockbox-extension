/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const ADD_ENTRY_STARTING = Symbol("ADD_ENTRY_STARTING");
export const ADD_ENTRY_COMPLETED = Symbol("ADD_ENTRY_COMPLETED");

export const UPDATE_ENTRY_STARTING = Symbol("UPDATE_ENTRY_STARTING");
export const UPDATE_ENTRY_COMPLETED = Symbol("UPDATE_ENTRY_COMPLETED");

export const REMOVE_ENTRY_STARTING = Symbol("REMOVE_ENTRY_STARTING");
export const REMOVE_ENTRY_COMPLETED = Symbol("REMOVE_ENTRY_COMPLETED");

export const SELECT_ENTRY_STARTING = Symbol("SELECT_ENTRY_STARTING");
export const SELECT_ENTRY_COMPLETED = Symbol("SELECT_ENTRY_COMPLETED");

export const START_NEW_ENTRY = Symbol("START_NEW_ENTRY");
export const CANCEL_NEW_ENTRY = Symbol("CANCEL_NEW_ENTRY");

// The action ID is used to correlate async actions with each other (i.e.
// FOO_STARTING and FOO_COMPLETED).
let nextActionId = 0;
let nextId = 0;
let datastore = [];

export function addEntry(details) {
  return (dispatch) => {
    const actionId = nextActionId++;
    dispatch(addEntryStarting(actionId, details));
    return new Promise((resolve, reject) => {
      const entry = {
        ...details,
        id: nextId++,
      };
      datastore.push(entry);
      dispatch(addEntryCompleted(actionId, entry));
    });
  };
}

function addEntryStarting(actionId, entry) {
  return {
    type: ADD_ENTRY_STARTING,
    actionId,
    entry,
  };
}

function addEntryCompleted(actionId, entry) {
  return {
    type: ADD_ENTRY_COMPLETED,
    actionId,
    entry,
  };
}

export function updateEntry(entry) {
  return (dispatch) => {
    const actionId = nextActionId++;
    dispatch(updateEntryStarting(actionId, entry));
    return new Promise((resolve, reject) => {
      for (let i = 0; i < datastore.length; i++) {
        if (datastore[i].id === entry.id) {
          datastore[i] = entry;
          break;
        }
      }
      dispatch(updateEntryCompleted(actionId, entry));
    });
  };
}

function updateEntryStarting(actionId, entry) {
  return {
    type: UPDATE_ENTRY_STARTING,
    actionId,
    entry,
  };
}

function updateEntryCompleted(actionId, entry) {
  return {
    type: UPDATE_ENTRY_COMPLETED,
    actionId,
    entry,
  };
}

export function removeEntry(id) {
  return (dispatch) => {
    const actionId = nextActionId++;
    dispatch(removeEntryStarting(actionId, id));
    return new Promise((resolve, reject) => {
      for (let i = 0; i < datastore.length; i++) {
        if (datastore[i].id === id) {
          datastore.splice(i, 1);
          break;
        }
      }
      dispatch(removeEntryCompleted(actionId, id));
    });
  };
}
    const actionId = nextActionId++;

function removeEntryStarting(actionId, id) {
  return {
    type: REMOVE_ENTRY_STARTING,
    actionId,
    id,
  };
}

function removeEntryCompleted(actionId, id) {
  return {
    type: REMOVE_ENTRY_COMPLETED,
    actionId,
    id,
  };
}

export function selectEntry(id) {
  return (dispatch) => {
    const actionId = nextActionId++;
    dispatch(selectEntryStarting(actionId, id));
    return new Promise((resolve, reject) => {
      for (let i = 0; i < datastore.length; i++) {
        if (datastore[i].id === id) {
          dispatch(selectEntryCompleted(actionId, datastore[i]));
          return;
        }
      }
    });
  };
}

function selectEntryStarting(actionId, id) {
  return {
    type: SELECT_ENTRY_STARTING,
    actionId,
    id,
  };
}

function selectEntryCompleted(actionId, entry) {
  return {
    type: SELECT_ENTRY_COMPLETED,
    actionId,
    entry,
  };
}

export function startNewEntry() {
  return {
    type: START_NEW_ENTRY,
  };
}

export function cancelNewEntry() {
  return {
    type: CANCEL_NEW_ENTRY,
  };
}
