/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Button from "../../../widgets/button";

import styles from "./upgrade-account.css";

export function UpgradeAccount({mode, ...props}) {
  if (mode !== "guest") {
    return null;
  }

  const doCreate = async () => {
    browser.runtime.sendMessage({
      type: "upgrade",
      action: "signup",
    });
  };
  const doSignIn = async () => {
    browser.runtime.sendMessage({
      type: "upgrade",
      action: "signin",
    });
  };

  return (
    <section className={styles.upgrade}>
      <Localized id="homepage-upgrade-title">
        <h2>uPGRADe</h2>
      </Localized>
      <Localized id="homepage-upgrade-description">
        <p>uPGRADe yOUr lOCKBOx</p>
      </Localized>
      <menu>
        <Localized id="homepage-upgrade-action-create">
          <Button id="homepage-upgrade-action-create"
                  size="puffy"
                  onClick={doCreate}>cREATe aCCOUNt</Button>
        </Localized>
        <Localized id="homepage-upgrade-action-signin">
          <Button id="homepage-upgrade-action-signin"
                  size="puffy"
                  onClick={doSignIn}>sIGn iN</Button>
        </Localized>
      </menu>
    </section>
  );
}

UpgradeAccount.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default connect(
  (state) => {
    return state.account;
  },
  (dispatch) => ({})
)(UpgradeAccount);
