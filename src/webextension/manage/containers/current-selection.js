/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import {
  addItem, updateItem, removeItem, editCurrentItem, cancelEditing,
} from "../actions";
import EditItemDetails from "../components/edit-item-details";
import ItemDetails from "../components/item-details";
import Homepage from "../components/homepage";

function unflattenItem(item, id) {
  return {
    id,
    title: item.title,
    origins: item.origin ? [item.origin] : [],
    entry: {
      kind: "login",
      username: item.username,
      password: item.password,
      notes: item.notes,
    },
  };
}

function flattenItem(item) {
  return {
    title: item.title,
    origin: item.origins[0] || "",
    username: item.entry.username,
    password: item.entry.password,
    notes: item.entry.notes,
  };
}

const ConnectedEditItemDetails = connect(
  (state, ownProps) => ({
    fields: ownProps.item ? flattenItem(ownProps.item) : undefined,
  }),
  (dispatch, ownProps) => {
    let onSave;
    if (ownProps.item) {
      onSave = (fields) => {
        dispatch(updateItem(unflattenItem(fields, ownProps.item.id)));
      };
    } else {
      onSave = (fields) => {
        dispatch(addItem(unflattenItem(fields)));
      };
    }

    return {
      onSave,
      onCancel: (changed) => {
        // FIXME: dispatch a different event when we have changes instead.
        if (!changed || confirm("You have unsaved changes. Are you sure you " +
                                "want to discard them?")) {
          dispatch(cancelEditing());
        }
      },
    };
  },
)(EditItemDetails);

const ConnectedItemDetails = connect(
  (state, ownProps) => ({
    fields: flattenItem(ownProps.item),
  }),
  (dispatch, ownProps) => ({
    onEdit: () => {
      dispatch(editCurrentItem());
    },
    onDelete: () => {
      // FIXME: dispatch a different event.
      if (confirm("Are you sure you want to delete this item?")) {
        dispatch(removeItem(ownProps.item.id));
      }
    },
  })
)(ItemDetails);

function CurrentSelection({editing, item, numItems}) {
  let inner;
  if (editing) {
    inner = <ConnectedEditItemDetails item={item}/>;
  } else if (item) {
    inner = <ConnectedItemDetails item={item}/>;
  } else {
    inner = <Homepage count={numItems}/>;
  }
  return <div>{inner}</div>;
}

CurrentSelection.propTypes = {
  editing: PropTypes.bool.isRequired,
  item: PropTypes.object,
  numItems: PropTypes.number.isRequired,
};

export default connect(
  (state) => ({
    editing: state.ui.editing,
    item: state.cache.currentItem,
    numItems: state.cache.items.length,
  })
)(CurrentSelection);
