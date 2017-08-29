/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import Item from "./item";
import styles from "./itemList.css";

export default function ItemList({items, selected, onItemClick}) {
  return (
    <ul className={styles.itemList}>
      {items.map((item) => (
        <Item key={item.id} name={item.title}
               selected={item.id === selected}
               onClick={() => onItemClick(item.id)}/>
      ))}
    </ul>
  );
}

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  selected: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
};
