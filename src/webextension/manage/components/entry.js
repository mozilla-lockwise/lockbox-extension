/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./entry.css";

export default function Entry({name, selected, onClick}) {
  const attrs = (selected) ? {"data-selected": true} : {};
  return (
    <li className={styles.entry} {...attrs} onClick={onClick}>{name}</li>
  );
}

Entry.propTypes = {
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
