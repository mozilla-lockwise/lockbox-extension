/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { addItem, cancelNewItem, updateItem, removeItem } from "../actions";
import ItemDetails from "../components/itemDetails";

import styles from "./currentItem.css";

function unflattenItem(item) {
  if (!item) {
    return item;
  }
  return {
    id: item.id,
    title: item.title,
    entry: {
      kind: "login",
      username: item.username,
      password: item.password,
    },
  };
}

function flattenItem(item) {
  if (!item) {
    return item;
  }
  return {
    id: item.id,
    title: item.title,
    username: item.entry.username,
    password: item.entry.password,
  };
}

function CurrentItem({noItem, item, onSave, onDelete}) {
  if (noItem) {
    return (
      <Localized id="no-item">
        <div className={styles.currentItem}>no iTEm sELECTEd</div>
      </Localized>
    );
  }
  return (
    <ItemDetails item={flattenItem(item)} onSave={onSave}
                 onDelete={onDelete}/>
  );
}

CurrentItem.propTypes = {
  noItem: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    item: PropTypes.shape({
      username: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }),
  }),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

CurrentItem = connect(
  (state) => {
    if (state.ui.newItem) {
      return { noItem: false, item: null };
    }
    return {
      noItem: state.cache.currentItem === null,
      item: state.cache.currentItem,
    };
  },
  (dispatch) => ({
    onSave: (item) => {
      item = unflattenItem(item);
      if (item.id === undefined) {
        dispatch(addItem(item));
      } else {
        dispatch(updateItem(item));
      }
    },
    onDelete: (id) => {
      if (id === undefined) {
        dispatch(cancelNewItem());
      } else {
        dispatch(removeItem(id));
      }
    },
  })
)(CurrentItem);

export default CurrentItem;
