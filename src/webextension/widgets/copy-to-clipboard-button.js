/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import copy from "copy-to-clipboard";

import Button from "./button";
import ButtonStack from "./button-stack";

import styles from "./copy-to-clipboard-button.css";

export default class CopyToClipboardButton extends React.Component {
  static get propTypes() {
    return {
      value: PropTypes.string.isRequired,
      title: PropTypes.string,
      timeout: PropTypes.number,
      onCopy: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      timeout: 2000,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  handleCopy() {
    const {value, timeout, onCopy} = this.props;
    copy(value);
    this.setState({copied: true});
    setTimeout(() => this.setState({copied: false}), timeout);
    if (onCopy) {
      onCopy();
    }
  }

  render() {
    const {title} = this.props;
    const selectedIndex = this.state.copied ? 1 : 0;
    return (
      <ButtonStack selectedIndex={selectedIndex}>
        <Localized id="copy-to-clipboard-button">
          <Button theme="ghost" className={styles.copyButton} title={title}
                  onClick={() => this.handleCopy()}>
            cOPy
          </Button>
        </Localized>
        <Localized id="copy-to-clipboard-copied">
          <span className={styles.copiedLabel}>
            cOPIEd
          </span>
        </Localized>
      </ButtonStack>
    );
  }
}
