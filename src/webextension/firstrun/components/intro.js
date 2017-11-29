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
      <Localized id="firstrun-intro-description">
        <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Sed
        posuere consectetur est at lobortis. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Etiam porta sem malesuada magna mollis euismod. Cras
        mattis consectetur purus sit amet fermentum.</p>
      </Localized>
      <p>
        <Localized id="firstrun-intro-warning">
          <strong>Lorem ipsum dolor sit amet, consectetur.
          Mauris, aliquam vel pellentesque et, mattis bibendum tellus. Fusce
          sodales, tellus a auctor accumsan, diam risus pharetra orci, at lacinia
          libero eros ut erat. Fusce ex neque, pharetra id rhoncus in,
          pellentesque quis urna.</strong>
        </Localized>
      </p>
    </section>
  );
}
