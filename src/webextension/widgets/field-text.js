/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./input.css";

export default function FieldText({className, monospace, ...props}) {
  const mono = monospace ? ` ${styles.monospace}` : "";
  const finalClassName = `${styles.fieldText}${mono} ${className}`.trimRight();
  return (
    <span className={finalClassName} {...props}/>
  );
}

FieldText.propTypes = {
  className: PropTypes.string,
  monospace: PropTypes.bool,
};

FieldText.defaultProps = {
  className: "",
  monospace: false,
};
