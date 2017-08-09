/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import { selectEntry } from "../actions";
import EntryList from "../components/entryList";

const AllEntries = connect(
  (state) => ({
    entries: state.storage.entries,
    selected: state.ui.selectedEntry,
  }),
  (dispatch) => ({
    onEntryClick: (id) => dispatch(selectEntry(id))
  })
)(EntryList);

export default AllEntries;
