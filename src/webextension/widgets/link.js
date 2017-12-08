/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./link.css";

export function ExternalLink({onClick, children, className, ...props}) {
  const finalClassName = `${styles.external} ${className}`.trimRight();
  return (
    <a {...props} className={finalClassName} onClick={onClick}>{children}</a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

ExternalLink.defaultProps = {
  className: "",
};
