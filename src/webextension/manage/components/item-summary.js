/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { withLocalization } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import styles from "./item-summary.css";

function ItemSummary({title, username, getString}) {
  return (
    <div className={styles.itemSummary}>
      <div>
        {title || getString("item-summary-no-title")}
      </div>
      <div className={styles.subtitle}>
        {username || getString("item-summary-no-username")}
      </div>
    </div>
  );
}

ItemSummary.propTypes = {
  title: PropTypes.string,
  username: PropTypes.string,
  getString: PropTypes.func.isRequired,
};

ItemSummary.defaultProps = {
  title: "",
  username: "",
  selected: false,
};

export default withLocalization(ItemSummary);
