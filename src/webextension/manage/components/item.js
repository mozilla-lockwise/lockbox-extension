/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { withLocalization } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import styles from "./item.css";

function Item({title, username, selected, getString, onClick}) {
  const attrs = (selected) ? {"data-selected": true} : {};
  return (
    <li className={styles.item} {...attrs} onClick={onClick}>
      <div>
        {title || getString("item-summary-no-title")}
      </div>
      <div className={styles.subtitle}>
        {username || getString("item-summary-no-username")}
      </div>
    </li>
  );
}

Item.propTypes = {
  title: PropTypes.string,
  username: PropTypes.string,
  selected: PropTypes.bool,
  getString: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withLocalization(Item);
