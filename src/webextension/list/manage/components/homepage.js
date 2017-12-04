/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import AccountDetails from "../containers/account-details";

import styles from "./homepage.css";

export default function Homepage() {
  const imgSrc = browser.extension.getURL("/images/nessie_v2.svg");

  return (
    <article className={styles.homepage}>
      <img src={imgSrc} alt=""/>
      <Localized id="homepage-title">
        <h1>{"tHe sIMPLe wAy tO sTORE..."}</h1>
      </Localized>
      <Localized id="homepage-greeting">
        <p>{"yOu'Ve suCCessfuLLY iNSTalled..."}</p>
      </Localized>
      <AccountDetails />
    </article>
  );
}

Homepage.propTypes = {
  count: PropTypes.number.isRequired,
};
