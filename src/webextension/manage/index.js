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
import { listItems, addedItem, updatedItem, removedItem } from "./actions";
import { reducer } from "./reducers";

const store = createStore(reducer, undefined, applyMiddleware(thunk));
store.dispatch(listItems());

// Listen for changes to the datastore from other sources and dispatch actions
// to sync those changes with our Redux store.
const messagePort = browser.runtime.connect();
messagePort.onMessage.addListener((message) => {
  switch (message.type) {
  case "added_item":
    store.dispatch(addedItem(message.item));
    break;
  case "updated_item":
    store.dispatch(updatedItem(message.item));
    break;
  case "removed_item":
    store.dispatch(removedItem(message.id));
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
