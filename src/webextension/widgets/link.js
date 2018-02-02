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
      onClick: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      className: "",
    };
  }

  get baseClassName() {
    return `${styles.link}`;
  }

  focus() {
    this.linkElement.focus();
  }

  render() {
    const {className, onClick, children, ...props} = this.props;
    const finalClassName = `${this.baseClassName} ${className}`.trimRight();
    return (
      <a href="#" ref={(element) => this.linkElement = element}
         {...props} className={finalClassName}
         onClick={(e) => { onClick(e); e.preventDefault(); }}>{children}</a>
    );
  }
}

export class ExternalLink extends Link {
  get baseClassName() {
    return `${styles.link} ${styles.external}`;
  }
}
