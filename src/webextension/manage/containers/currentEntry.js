/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import { updateEntry, deleteEntry } from "../actions";
import EntryDetails from "../components/entryDetails";

const CurrentEntry = connect(
  (state) => {
    const selected = state.storage.entries.find(
      (x) => x.id === state.ui.selectedEntry
    );
    return selected || { id: null };
  },
  (dispatch) => ({
    onSave: (id, name) => dispatch(updateEntry(id, name)),
    onDelete: (id) => dispatch(deleteEntry(id)),
  })
)(EntryDetails);

export default CurrentEntry;
