/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./link.css";

export class Link extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.node,
      className: PropTypes.string,
      role: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      className: "",
      role: "link",
    };
  }

  get baseClassName() {
    return `${styles.link}`;
  }

  focus() {
    this.linkElement.focus();
  }

  render() {
    const {className, role, onClick, children, ...props} = this.props;
    const finalClassName = `${this.baseClassName} ${className}`.trimRight();
    return (
      <button ref={(element) => this.linkElement = element}
              {...props} className={finalClassName} role={role}
              onClick={onClick}>
        {children}
      </button>
    );
  }
}

// XXX: External links go to a real URL, and we should probably indicate that to
// the user (by Firefox showing the URL in the bottom of the window), even if
// the actual loading of the URL happens in a Redux action.

export class ExternalLink extends Link {
  get baseClassName() {
    return `${styles.link} ${styles.external}`;
  }
}
