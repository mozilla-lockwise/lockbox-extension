/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import styles from "./account-linked.css";

export default function AccountLinked() {
  return (
    <section className={styles.linked}>
      <Localized id="homepage-accountlinked-title">
        <h2>aCCOUNt lINKEd</h2>
      </Localized>
      <Localized id="homepage-accountlinked-description">
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
      </Localized>
    </section>
  );
}
