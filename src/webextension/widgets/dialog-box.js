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
    const {children, buttonLabels, onClick, onClose} = this.props;
    return (
      <section className={styles.modalDialog}>
        <div>
          {children}
        </div>
        <menu>
          {buttonLabels.map((label, i) => {
            let primaryProps = {};
            if (i === 0) {
              primaryProps = {
                theme: "primary",
                ref: (element) => this._primaryButton = element,
              };
            }

            return (
              <Button key={i} onClick={() => { onClick(i); onClose(); }}
                      {...primaryProps}>
                {label}
              </Button>
            );
          })}
        </menu>
      </section>
    );
  }
}

DialogBox.propTypes = {
  children: PropTypes.node.isRequired,
  buttonLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
