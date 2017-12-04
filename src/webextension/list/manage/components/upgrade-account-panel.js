/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import Button from "../../../widgets/button";

import styles from "./upgrade-account-panel.css";

export default function UpgradeAccountPanel({ mode, doCreateAccount, doSignIn }) {
  if (mode !== "guest") {
    return null;
  }

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
          <Button size="puffy"
                  onClick={doCreateAccount}>cREATe aCCOUNt</Button>
        </Localized>
        <Localized id="homepage-upgrade-action-signin">
          <Button size="puffy"
                  onClick={doSignIn}>sIGn iN</Button>
        </Localized>
      </menu>
    </section>
  );
}
UpgradeAccountPanel.propTypes = {
  mode: PropTypes.string.isRequired,
  doCreateAccount: PropTypes.func.isRequired,
  doSignIn: PropTypes.func.isRequired,
};
