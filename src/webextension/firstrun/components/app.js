/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";
import DocumentTitle from "react-document-title";

import Intro from "./intro";
import StartUsing from "./using";

import styles from "./app.css";

export default function App() {
  const imgSrc = browser.extension.getURL("/images/nessie_v2.svg");

  return (
    <Localized id="document">
      <DocumentTitle title="wELCOMe to lOCKBOx">
        <article className={styles.firstrun}>
          <img src={imgSrc} alt=""/>
          <Intro />
          <StartUsing />
        </article>
      </DocumentTitle>
    </Localized>
  );
}
