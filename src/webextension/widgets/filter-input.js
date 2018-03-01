/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import styles from "./input.css";

export default class FilterInput extends React.Component {
  static get propTypes() {
    return {
      className: PropTypes.string,
      onChange: PropTypes.func,
      value: PropTypes.string,
      disabled: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      className: "",
      value: "",
      disabled: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  updateValue(value) {
    if (value !== this.state.value) {
      this.setState({value});
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }

  focus() {
    this.inputElement.focus();
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {className, onChange, value, disabled, ...props} = this.props;
    const disabledClass = disabled ? ` ${styles.disabled}` : "";
    const finalClassName = (
      `${styles.filter} ${styles.inputWrapper}${disabledClass} ${className}`
    ).trimRight();

    return (
      <div className={finalClassName}>
        <input type="search" disabled={disabled} value={this.state.value}
               onChange={(e) => this.updateValue(e.target.value)}
               ref={(element) => this.inputElement = element} {...props}/>
        <Localized id="filter-input-clear">
          <button type="button" title="cLEAr" disabled={disabled}
                  onClick={() => this.updateValue("")}/>
        </Localized>
      </div>
    );
  }
}
