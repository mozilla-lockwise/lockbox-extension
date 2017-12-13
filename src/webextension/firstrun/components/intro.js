/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import styles from "./intro.css";

export default function Intro() {
  return (
    <section className={styles.intro}>
      <Localized id="firstrun-intro-title">
        <h1>wELCOMe</h1>
      </Localized>
      <Localized id="firstrun-intro-tagline">
        <h2>mORe wELCOMe</h2>
      </Localized>
    </section>
  );
}
