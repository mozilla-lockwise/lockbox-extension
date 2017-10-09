/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { withLocalization } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import styles from "./error-message.css";

function ErrorMessage({code, getString}) {
  let txt = code ? getString(code) : "\u00a0";

  return (
    <span className={styles.errorMessage}>{txt}</span>
  );
}
ErrorMessage.propTypes = {
  code: PropTypes.string,
  getString: PropTypes.func.isRequired,
};

export default withLocalization(ErrorMessage);
