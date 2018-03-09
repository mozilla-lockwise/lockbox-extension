/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import ItemSummary from "./item-summary";
import ScrollingList from "../../widgets/scrolling-list";

import styles from "./item-list.css";

export default function ItemList({items, itemClassName, verbose, onCopy,
                                  ...props}) {
  const verboseClass = verbose ? ` ${styles.verbose}` : "";
  const finalItemClassName = (
    `${styles.item}${verboseClass} ${itemClassName}`
  ).trimRight();

  return (
    <ScrollingList itemClassName={finalItemClassName} data={items} {...props}>
      {({id, title, username}) => {
        return (
          <ItemSummary id={id} title={title} username={username}
                       verbose={verbose} onCopy={onCopy}/>
        );
      }}
    </ScrollingList>
  );
}

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  itemClassName: PropTypes.string,
  verbose: PropTypes.bool,
  onCopy: PropTypes.func,
};

ItemList.defaultProps = {
  itemClassName: "",
  verbose: false,
};

export function ItemListPlaceholder({children}) {
  return (
    <div className={styles.empty}>
      {children}
    </div>
  );
}

ItemListPlaceholder.propTypes = {
  children: PropTypes.node,
};
