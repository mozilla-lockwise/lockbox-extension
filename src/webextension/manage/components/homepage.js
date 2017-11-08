/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { withLocalization } from "fluent-react";
import { Localized } from 'fluent-react';
import PropTypes from "prop-types";
import React from "react";
import DocumentTitle from "react-document-title";


import styles from "./homepage.css";

function Homepage({count, getString}) {
  const imgSrc = browser.extension.getURL("/images/lockie_v2.svg");

  let key;
  if (count === 0) {
    key = "homepage-no-passwords-title";
  } else {
    key = "homepage-has-passwords-title";
  }

  return (
    <article className={styles.homepage}>
      <img src={imgSrc}/>
      <DocumentTitle title="wELCOMe to lOCKBOx">
        <h1>{
          getString(key, {count})
        }</h1>
      </DocumentTitle>
      <Localized id="homepage-greeting">
        <p>{'yOu\'Ve suCCessfuLLY iNSTalled...'}</p>
      </Localized>
    </article>
  );
}

Homepage.propTypes = {
  count: PropTypes.number.isRequired,
  getString: PropTypes.func.isRequired,
};

export default withLocalization(Homepage);
