/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { requestSelectItem } from "../../actions";
import { parseFilterString, filterItem } from "../../filter";
import { NEW_ITEM_ID } from "../../common";
import ItemList, { ItemListPlaceholder } from "../../components/item-list";

const collator = new Intl.Collator();

function AllItems({totalItemCount, ...props}) {
  if (props.items.length === 0) {
    return (
      <Localized id={`all-items-${totalItemCount ? "filtered" : "empty"}`}>
        <ItemListPlaceholder>
          wHEn yOu cREATe an eNTRy...
        </ItemListPlaceholder>
      </Localized>
    );
  }
  return (
    <ItemList {...props}/>
  );
}

AllItems.propTypes = {
  totalItemCount: PropTypes.number.isRequired,
  ...ItemList.propTypes,
};

export default connect(
  (state, ownProps) => {
    const totalItemCount = state.cache.items.length;
    const filter = parseFilterString(state.list.filter);
    const selected = state.list.selectedItemId;
    const items = state.cache.items
                       .filter((i) => filterItem(filter, i))
                       .sort((a, b) => collator.compare(a.title, b.title));

    if (selected === NEW_ITEM_ID) {
      items.unshift({id: NEW_ITEM_ID, title: "", username: ""});
    }
    return {totalItemCount, items, selected};
  },
  (dispatch) => ({
    onChange: (id) => dispatch(requestSelectItem(id)),
  }),
)(AllItems);
