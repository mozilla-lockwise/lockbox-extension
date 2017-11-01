/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import ButtonStack from "./button-stack.js";

import styles from "./input.css";

export default class PasswordInput extends React.Component {
  static get propTypes() {
    return {
      onChange: PropTypes.func,
      value: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      showPassword: false,
    };
  }

  showPassword(show) {
    if (show) {
      this.stackElement.selectedIndex = 1;
      this.setState({showPassword: true});
    } else {
      this.stackElement.selectedIndex = 0;
      this.setState({showPassword: false});
    }
  }

  focus() {
    this.inputElement.focus();
  }

  render() {
    return (
      <div className={styles.inputWrapper}>
        <input type={this.state.showPassword ? "text" : "password"}
               ref={(element) => this.inputElement = element} {...this.props}/>
        <ButtonStack ref={(element) => this.stackElement = element}>
          <Localized id="password-input-show">
            <button type="button"
                    onClick={() => this.showPassword(true)}>sHOw</button>
          </Localized>
          <Localized id="password-input-hide">
            <button type="button"
                    onClick={() => this.showPassword(false)}>hIDe</button>
          </Localized>
        </ButtonStack>
      </div>
    );
  }
}
