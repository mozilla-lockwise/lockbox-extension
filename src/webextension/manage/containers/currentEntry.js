/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import { deleteEntry } from "../actions";
import EntryDetails from "../components/entryDetails";

const CurrentEntry = connect(
  (state) => {
    let selected = state.storage.entries.find(
      (x) => x.id === state.ui.selectedEntry
    );
    return {
      name: selected ? selected.name : null,
      id: state.ui.selectedEntry,
    };
  },
  (dispatch) => ({
    onDelete: (id) => dispatch(deleteEntry(id))
  })
)(EntryDetails);

export default CurrentEntry;
