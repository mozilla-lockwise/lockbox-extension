/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import { selectItem } from "../actions";
import ItemList from "../components/item-list";

const collator = new Intl.Collator();

const AllItems = connect(
  (state) => {
    let currentId = null;
    if (!state.ui.newItem && state.cache.currentItem) {
      currentId = state.cache.currentItem.id;
    }
    return {
      items: [...state.cache.items].sort(
        (a, b) => collator.compare(a.title, b.title)
      ),
      selected: currentId,
    };
  },
  (dispatch) => ({
    onItemClick: (id) => dispatch(selectItem(id)),
  })
)(ItemList);

export default AllItems;
