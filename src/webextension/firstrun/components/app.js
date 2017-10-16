/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";

import Welcome from "./welcome";
import MasterPasswordSetup from "./master-password-setup";

import styles from "./app.css";

export default function App() {
  // Eventually, we'll have a feedback button up top here, and maybe some other
  // stuff.
  const imgSrc = browser.extension.getURL("/images/lockie_v1.png");

  return (
    <article className={styles.firstrun}>
      <img src={imgSrc}/>
      <Welcome />
      <MasterPasswordSetup />
    </article>
  );
}
