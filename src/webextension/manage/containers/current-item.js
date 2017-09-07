/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { addItem, cancelNewItem, updateItem, removeItem } from "../actions";
import ItemDetails from "../components/item-details";

import styles from "./current-item.css";

const NEW_ITEM = Symbol("NEW_ITEM");

function unflattenItem(item, id) {
  return {
    id,
    title: item.title,
    entry: {
      kind: "login",
      username: item.username,
      password: item.password,
    },
  };
}

function flattenItem(item) {
  return {
    title: item.title,
    username: item.entry.username,
    password: item.entry.password,
  };
}

const itemProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  item: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }),
});

function NewItem({onAction}) {
  function onSave(item) {
    onAction(addItem(unflattenItem(item)));
  }
  function onDelete() {
    onAction(cancelNewItem());
  }

  return (
    <section>
      <Localized id="new-item-title">
        <h1>nEw iTEm</h1>
      </Localized>
      <ItemDetails saveLabel="save-item" deleteLabel="cancel-item"
                   onSave={onSave} onDelete={onDelete}/>
    </section>
  );
}

NewItem.propTypes = {
  onAction: PropTypes.func.isRequired,
};

function UpdateItem({item, onAction}) {
  function onSave(updatedItem) {
    onAction(updateItem(unflattenItem(updatedItem, item.id)));
  }
  function onDelete() {
    onAction(removeItem(item.id));
  }

  return (
    <section>
      <Localized id="update-item-title">
        <h1>nEw iTEm</h1>
      </Localized>
      <ItemDetails fields={flattenItem(item)}
                   saveLabel="update-item" deleteLabel="delete-item"
                   onSave={onSave} onDelete={onDelete}/>
    </section>
  );
}

UpdateItem.propTypes = {
  item: itemProps.isRequired,
  onAction: PropTypes.func.isRequired,
};

function CurrentItem({item, onAction}) {
  let inner;
  if (item === NEW_ITEM) {
    inner = <NewItem onAction={onAction}/>;
  } else if (item) {
    inner = <UpdateItem item={item} onAction={onAction}/>;
  } else {
    inner = (
      <Localized id="no-item">
        <div>no iTEm sELECTEd</div>
      </Localized>
    );
  }
  return <div className={styles.currentItem}>{inner}</div>;
}

CurrentItem.propTypes = {
  item: PropTypes.oneOfType([itemProps, PropTypes.symbol]),
  onAction: PropTypes.func.isRequired,
};

CurrentItem = connect(
  (state) => ({
    item: state.ui.newItem ? NEW_ITEM : state.cache.currentItem,
  }),
  (dispatch) => ({
    onAction: (action) => {
      dispatch(action);
    },
  })
)(CurrentItem);

export default CurrentItem;
