/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./button.css";

export default class Button extends React.Component {
  static get propTypes() {
    return {
      className: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      className: "",
    };
  }

  focus() {
    this.buttonElement.focus();
  }

  render() {
    const {className, ...props} = this.props;
    const finalClassName = `browser-style ${styles.button} ${className}`
                           .trimRight();
    return (
      <button className={finalClassName} {...props}
              ref={(element) => this.buttonElement = element}/>
    );
  }
}
