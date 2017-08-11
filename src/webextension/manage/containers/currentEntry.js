/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import React from "react";
import { connect } from "react-redux";

import { updateEntry, deleteEntry } from "../actions";
import EntryDetails from "../components/entryDetails";

function CurrentEntry(props) {
  if ("id" in props)
    return <EntryDetails {...props}/>;
  return (
    <Localized id="no-entry">
      <div style={{margin: "1em"}}>no eNTRy sELECTEd</div>
    </Localized>
  );
}

CurrentEntry = connect(
  (state) => {
    return state.storage.entries.find(
      (x) => x.id === state.ui.selectedEntry
    ) || {};
  },
  (dispatch) => ({
    onSave: (id, name) => dispatch(updateEntry(id, name)),
    onDelete: (id) => dispatch(deleteEntry(id)),
  })
)(CurrentEntry);

export default CurrentEntry;
