/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import styles from "./password-input.css";

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

  toggleShowPassword() {
    this.setState({showPassword: !this.state.showPassword});
  }

  render() {
    return (
      <div className={styles.passwordInput}>
        <span className="browser-style">
          <input type={this.state.showPassword ? "text" : "password"}
                 {...this.props}/>
        </span>
        <Localized id={this.state.showPassword ? "password-input-hide" :
                       "password-input-show"}>
          <button type="button" className="browser-style"
                  onClick={() => this.toggleShowPassword()}>sHOw/hIDe</button>
        </Localized>
      </div>
    );
  }
}
