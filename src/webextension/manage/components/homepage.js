/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { withLocalization } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import styles from "./homepage.css";

function Homepage({count, getString}) {
  const imgSrc = browser.extension.getURL("/images/lockie_v2.svg");

  let key;
  if (count === 0) {
    key = "homepage-no-passwords";
  } else if (count < 10) {
    key = "homepage-under-10-passwords";
  } else if (count < 50) {
    key = "homepage-under-50-passwords";
  } else {
    key = "homepage-over-50-passwords";
  }

  return (
    <article className={styles.homepage}>
      <img src={imgSrc}/>
      <p>{
        getString(key, {count})
      }</p>
    </article>
  );
}

Homepage.propTypes = {
  count: PropTypes.number.isRequired,
  getString: PropTypes.func.isRequired,
};

export default withLocalization(Homepage);
