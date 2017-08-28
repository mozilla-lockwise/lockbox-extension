/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import { selectEntry } from "../actions";
import EntryList from "../components/entryList";

const collator = new Intl.Collator();

const AllEntries = connect(
  (state) => {
    let currentId = null;
    if (!state.ui.newEntry && state.cache.currentEntry)
      currentId = state.cache.currentEntry.id;
    return {
      entries: [...state.cache.entries].sort(
        (a, b) => collator.compare(a.title, b.title)
      ),
      selected: currentId,
    };
  },
  (dispatch) => ({
    onEntryClick: (id) => dispatch(selectEntry(id))
  })
)(EntryList);

export default AllEntries;
