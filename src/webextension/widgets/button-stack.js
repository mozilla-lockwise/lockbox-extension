/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./button-stack.css";

export default class ButtonStack extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.node,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  get selectedIndex() {
    return this.state.selectedIndex;
  }

  set selectedIndex(value) {
    this.setState({selectedIndex: value});
    return value;
  }

  render() {
    const { children } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div className={styles.stack}>
        {React.Children.map(children, (child, i) => {
          const props = {};
          if (i === selectedIndex) {
            props["data-selected"] = true;
          }

          return (
            <span className={styles.stackItem} key={i} {...props}>
              {child}
            </span>
          );
        })}
      </div>
    );
  }
}
