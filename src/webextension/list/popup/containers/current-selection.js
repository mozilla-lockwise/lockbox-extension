/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { flattenItem } from "../../common";
import { selectItem } from "../../actions";
import ItemDetailsPanel from "../components/item-details-panel";
import ItemListPanel from "../components/item-list-panel";

const ConnectedItemDetailsPanel = connect(
  (state, ownProps) => ({
    fields: flattenItem(ownProps.item),
  }),
  (dispatch) => ({
    onCopy: (field) => { /* TODO */ },
    onBack: () => { dispatch(selectItem(null)); },
  })
)(ItemDetailsPanel);

function CurrentSelection({item}) {
  if (item) {
    return <ConnectedItemDetailsPanel item={item}/>;
  }
  return <ItemListPanel/>;
}

CurrentSelection.propTypes = {
  item: PropTypes.object,
};

export default connect(
  (state) => ({
    item: state.cache.currentItem,
  })
)(CurrentSelection);
