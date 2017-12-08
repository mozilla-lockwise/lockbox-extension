/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./link.css";

export function ExternalLink({onClick, children}) {
  return (
    <a className={styles.external} onClick={onClick}>{children}</a>
  );
}

ExternalLink.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
};
