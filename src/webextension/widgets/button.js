/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./button.css";

const THEME_CLASS_NAME = {
  primary: "browser-style default",
  normal: "browser-style",
  minimal: `browser-style ${styles.minimal}`,
};

export default class Button extends React.Component {
  static get propTypes() {
    return {
      theme: PropTypes.oneOf(["primary", "normal", "minimal"]),
      className: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      theme: "normal",
      className: "",
    };
  }

  focus() {
    this.buttonElement.focus();
  }

  render() {
    const {className, theme, ...props} = this.props;
    const finalClassName = (
      `${THEME_CLASS_NAME[theme]} ${styles.button} ${className}`
    ).trimRight();

    return (
      <button className={finalClassName} {...props}
              ref={(element) => this.buttonElement = element}/>
    );
  }
}
