/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import Button from "../../../widgets/button";

import styles from "./link-account.css";

export default function LinkAccount({ onCreate, onSignin }) {
  return (
    <section className={styles.link}>
      <Localized id="homepage-linkaccount-title">
        <h2>uPGRADe</h2>
      </Localized>
      <Localized id="homepage-linkaccount-description">
        <p>uPGRADe yOUr lOCKBOx</p>
      </Localized>
      <menu>
        <Localized id="homepage-linkaccount-action-create">
          <Button size="puffy"
                  onClick={onCreate}>cREATe aCCOUNt</Button>
        </Localized>
        <Localized id="homepage-linkaccount-action-signin">
          <Button size="puffy"
                  onClick={onSignin}>sIGn iN</Button>
        </Localized>
      </menu>
    </section>
  );
}
LinkAccount.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onSignin: PropTypes.func.isRequired,
};
