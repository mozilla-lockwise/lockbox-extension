/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import { NEW_ITEM_ID } from "..";
import styles from "./item-summary.css";

export default function ItemSummary({id, title, username}) {
  title = title.trim();
  username = username.trim();

  const titleId = `item-summary-${id === NEW_ITEM_ID ? "new-title" : "title"}`;
  return (
    <div className={styles.itemSummary}>
      <Localized id={titleId} $title={title} $length={title.length}>
        <div className={styles.title}>no tITLe</div>
      </Localized>
      <Localized id="item-summary-username" $username={username}
                 $length={username.length}>
        <div className={styles.subtitle}>no uSERNAMe</div>
      </Localized>
    </div>
  );
}

ItemSummary.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  username: PropTypes.string,
};

ItemSummary.defaultProps = {
  id: null,
  title: "",
  username: "",
};
