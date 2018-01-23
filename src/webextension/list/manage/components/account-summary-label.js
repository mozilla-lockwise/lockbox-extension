/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./account-summary-label.css";

export default function AccountSummaryLabel({displayName, avatar}) {
  if (!displayName) {
    return null;
  }

  return (
    <span className={styles.accountSummary}><img src={avatar} /> {displayName}</span>
  );
}

AccountSummaryLabel.propTypes = {
  displayName: PropTypes.string,
  avatar: PropTypes.string,
};
