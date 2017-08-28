/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { addEntry, cancelNewEntry, updateEntry, removeEntry } from "../actions";
import EntryDetails from "../components/entryDetails";

import styles from "./currentEntry.css";

function unflattenEntry(entry) {
  if (!entry)
    return entry;
  return {
    id: entry.id,
    title: entry.title,
    entry: {
      kind: "login",
      username: entry.username,
      password: entry.password,
    },
  };
}

function flattenEntry(entry) {
  if (!entry)
    return entry;
  return {
    id: entry.id,
    title: entry.title,
    username: entry.entry.username,
    password: entry.entry.password,
  };
}

function CurrentEntry({noEntry, entry, onSave, onDelete}) {
  if (noEntry) {
    return (
      <Localized id="no-entry">
        <div className={styles.currentEntry}>no eNTRy sELECTEd</div>
      </Localized>
    );
  }
  return (
    <EntryDetails entry={flattenEntry(entry)} onSave={onSave}
                  onDelete={onDelete}/>
  );
}

CurrentEntry.propTypes = {
  noEntry: PropTypes.bool.isRequired,
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    entry: PropTypes.shape({
      username: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }),
  }),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

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
        return dispatch(addEntry(unflattenEntry(entry)));
      return dispatch(updateEntry(unflattenEntry(entry)));
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
