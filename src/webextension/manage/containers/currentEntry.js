/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import React from "react";
import { connect } from "react-redux";

import { addEntry, cancelNewEntry, updateEntry, removeEntry } from "../actions";
import EntryDetails from "../components/entryDetails";

import styles from "./currentEntry.css";

function CurrentEntry({noEntry, entry, onSave, onDelete}) {
  if (noEntry) {
    return (
      <Localized id="no-entry">
        <div className={styles.currentEntry}>no eNTRy sELECTEd</div>
      </Localized>
    );
  }
  return (
    <EntryDetails entry={entry} onSave={onSave} onDelete={onDelete}/>
  );
}

CurrentEntry = connect(
  (state) => {
    if (state.ui.newEntry)
      return { noEntry: false, entry: null };
    return {
      noEntry: state.cache.currentEntry === null,
      entry: state.cache.currentEntry,
    };
  },
  (dispatch) => {
    return {
    onSave: (entry) => {
      if (entry.id === undefined)
        return dispatch(addEntry(entry));
      return dispatch(updateEntry(entry));
    },
    onDelete: (id) => {
      if (id === undefined)
        return dispatch(cancelNewEntry());
      return dispatch(removeEntry(id));
    },
  }
  }
)(CurrentEntry);

export default CurrentEntry;
