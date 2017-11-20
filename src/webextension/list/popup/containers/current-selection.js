/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { selectItem } from "../../actions";
import ItemDetailsPanel from "../components/item-details-panel";
import ItemListPanel from "../components/item-list-panel";

function flattenItem(item) {
  return {
    title: item.title,
    origin: item.origins[0] || "",
    username: item.entry.username,
    password: item.entry.password,
    notes: item.entry.notes,
  };
}

function CurrentSelection({item, goHome}) {
  if (item) {
    return <ItemDetailsPanel fields={flattenItem(item)} onBack={goHome}/>;
  }
  return <ItemListPanel/>;
}

CurrentSelection.propTypes = {
  item: PropTypes.object,
  goHome: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    item: state.cache.currentItem,
  }),
  (dispatch) => ({
    goHome: () => { dispatch(selectItem(null)); },
  })
)(CurrentSelection);
