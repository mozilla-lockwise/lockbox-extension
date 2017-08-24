/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { AppLocalizationProvider } from "./l10n";
import App from "./components/app";
import { listEntries, addedEntry, updatedEntry, removedEntry } from "./actions";
import { reducer } from "./reducers";

const store = createStore(reducer, undefined, applyMiddleware(thunk));
store.dispatch(listEntries());

// Listen for changes to the datastore from other sources and dispatch actions
// to sync those changes with our Redux store.
const messagePort = browser.runtime.connect();
messagePort.onMessage.addListener((message) => {
  switch (message.type) {
  case "added_entry":
    store.dispatch(addedEntry(message.entry));
    break;
  case "updated_entry":
    store.dispatch(updatedEntry(message.entry));
    break;
  case "removed_entry":
    store.dispatch(removedEntry(message.id));
    break;
  }
});

ReactDOM.render(
  <Provider store={store}>
    <AppLocalizationProvider userLocales={navigator.languages}>
      <App/>
    </AppLocalizationProvider>
  </Provider>,
  document.getElementById("content")
);
