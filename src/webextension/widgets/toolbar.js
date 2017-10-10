/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./toolbar.css";

export default function Toolbar({className, children}) {
  const finalClassName = `${styles.toolbar} ${className}`.trimRight();
  return (
    <menu className={finalClassName}>
      {children}
    </menu>
  );
}

Toolbar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function ToolbarSpace({className}) {
  const finalClassName = `${styles.toolbarSpace} ${className}`.trimRight();
  return (
    <span className={finalClassName}/>
  );
}

ToolbarSpace.propTypes = {
  className: PropTypes.string,
};

