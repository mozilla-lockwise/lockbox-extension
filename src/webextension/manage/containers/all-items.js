/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import { selectItem } from "../actions";
import { filterItem } from "../filter.js";
import ItemList from "../components/item-list";

const collator = new Intl.Collator();

export default connect(
  (state) => {
    let currentId = null;
    if (!state.ui.newItem && state.cache.currentItem) {
      currentId = state.cache.currentItem.id;
    }

    return {
      items: state.cache.items
             .filter((i) => filterItem(state.ui.filter, i))
             .sort((a, b) => collator.compare(a.title, b.title)),
      selected: currentId,
    };
  },
  (dispatch) => ({
    onItemSelected: (id) => dispatch(selectItem(id)),
  })
)(ItemList);
