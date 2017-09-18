/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./filter-input.css";

export default class FilterInput extends React.Component {
  static get propTypes() {
    return {
      onChange: PropTypes.func,
      value: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || "",
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

  render() {
    // eslint-disable-next-line no-unused-vars
    const {onChange, value, ...props} = this.props;

    // Our input should probably be `type="search"`, but there's no browser-
    // style for that.
    return (
      <div className={styles.filterInput}>
        <span className="browser-style">
          <input type="text" role="search" {...props} value={this.state.value}
                 onChange={(e) => this.updateValue(e.target.value)}/>
        </span>
        <button type="button" className="browser-style"
                onClick={() => this.updateValue("")}>X</button>
      </div>
    );
  }
}
