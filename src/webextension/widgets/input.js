/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./input.css";

export default class Input extends React.Component {
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
    this.inputElement.focus();
  }

  render() {
    const {className, ...props} = this.props;
    const finalClassName = `${styles.input} ${className}`.trimRight();
    return (
      <input className={finalClassName} {...props}
             ref={(element) => this.inputElement = element}/>
    );
  }
}
