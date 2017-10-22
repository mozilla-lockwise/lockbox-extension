/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import Button from "./button";

import styles from "./dialog-box.css";

export default class DialogBox extends React.Component {
  componentDidMount() {
    this._primaryButton.focus();
  }

  render() {
    const {text, primaryButtonLabel, secondaryButtonLabel, onClickPrimary,
           onClickSecondary} = this.props;
    return (
      <section className={styles.modalDialog}>
        <div>{text}</div>
        <menu>
          <Button theme="primary" onClick={() => { onClickPrimary(); }}
                  ref={(element) => this._primaryButton = element}>
            {primaryButtonLabel}
          </Button>
          <Button onClick={() => { onClickSecondary(); }}>
            {secondaryButtonLabel}
          </Button>
        </menu>
      </section>
    );
  }
}

DialogBox.propTypes = {
  text: PropTypes.string.isRequired,
  primaryButtonLabel: PropTypes.string.isRequired,
  secondaryButtonLabel: PropTypes.string.isRequired,
  onClickPrimary: PropTypes.func.isRequired,
  onClickSecondary: PropTypes.func.isRequired,
};
