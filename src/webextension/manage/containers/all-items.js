/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { withLocalization } from "fluent-react";
import React from "react";
import { connect } from "react-redux";

import { requestSelectItem } from "../actions";
import { parseFilterString, filterItem } from "../filter";
import { NEW_ITEM_ID } from "../common";
import ItemList from "../components/item-list";

const collator = new Intl.Collator();

function AllItems({items, selected, getString, ...props}) {
  if (selected === NEW_ITEM_ID) {
    items = [
      { title: getString("item-summary-new-item"),
        id: NEW_ITEM_ID,
        username: "" },
      ...items,
    ];
  }

  return <ItemList {...{items, selected, ...props}}/>;
}

AllItems.propTypes = {
  ...ItemList.propTypes,
};

export default connect(
  (state, ownProps) => {
    const filter = parseFilterString(state.filter);
    return {
      items: state.cache.items
                  .filter((i) => filterItem(filter, i))
                  .sort((a, b) => collator.compare(a.title, b.title)),
      selected: state.ui.selectedItemId,
    };
  },
  (dispatch) => ({
    onItemSelected: (id) => dispatch(requestSelectItem(id)),
  }),
)(withLocalization(AllItems));
