/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-modal";

import { classNames } from "../../../common";
import { Link } from "../../../widgets/link";

import styles from "./account-summary.css";

export function AccountSummaryButton({displayName, avatar, onClick}) {
  if (!displayName) {
    return null;
  }

  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.displayName}>{displayName}</span>
      <span className={styles.avatar}><img src={avatar}/></span>
    </button>
  );
}

AccountSummaryButton.propTypes = {
  displayName: PropTypes.string,
  avatar: PropTypes.string,
  onClick: PropTypes.func,
};

export function AccountSummaryDropdown({isOpen, onClose, onClickAccount,
                                        onClickOptions, onClickSignout}) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}
           className={styles.dropdown}
           overlayClassName={styles.dropdownOverlay}>
      <ul>
        <li>
          <Localized id="account-summary-account">
            <Link className={classNames([styles.dropdownLink, styles.account])}
                  onClick={() => { onClickAccount(); onClose(); }}>
              aCCOUNt
            </Link>
          </Localized>
        </li>
        <li>
          <Localized id="account-summary-options">
            <Link className={classNames([styles.dropdownLink, styles.options])}
                  onClick={() => { onClickOptions(); onClose(); }}>
              oPTIONs
            </Link>
          </Localized>
        </li>
        <li>
          <Localized id="account-summary-signout">
            <Link className={classNames([styles.dropdownLink, styles.signout])}
                  onClick={() => { onClickSignout(); onClose(); }}>
              sIGn oUt
            </Link>
          </Localized>
        </li>
      </ul>
    </Modal>
  );
}

AccountSummaryDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickAccount: PropTypes.func.isRequired,
  onClickOptions: PropTypes.func.isRequired,
  onClickSignout: PropTypes.func.isRequired,
};

export default class AccountSummary extends React.Component {
  static get propTypes() {
    return {
      displayName: PropTypes.string,
      avatar: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
    };
  }

  openDropdown() {
    this.setState({showDropdown: true});
  }

  closeDropdown() {
    this.setState({showDropdown: false});
  }

  render() {
    const {displayName, avatar, ...props} = this.props;
    const {showDropdown} = this.state;
    return (
      <div>
        <AccountSummaryButton displayName={displayName} avatar={avatar}
                              onClick={() => this.openDropdown()}/>
        <AccountSummaryDropdown {...props} isOpen={showDropdown}
                                onClose={() => this.closeDropdown()}/>
      </div>
    );
  }
}
