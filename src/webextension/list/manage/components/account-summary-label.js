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
    <div className={styles.accountSummary}>
      <span className={styles.avatar}><img src={avatar} /></span>
      <span className={styles.displayName}>{displayName}</span>
    </div>
  );
}

AccountSummaryLabel.propTypes = {
  displayName: PropTypes.string,
  avatar: PropTypes.string,
};
