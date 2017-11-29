/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../widgets/button";

import styles from "./using.css";

export default function StartUsing() {
  const doGuest = () => {
    browser.runtime.sendMessage({
      type: "initialize",
    });
    browser.runtime.sendMessage({
      type: "close_view",
      name: "firstrun",
    });
  };
  const doReturning = () => {
    browser.runtime.sendMessage({
      type: "upgrade",
    });
    browser.runtime.sendMessage({
      type: "close_view",
      name: "firstrun",
    });
  };

  return (
    <section className={styles.using}>
      <Localized id="firstrun-using-title">
        <h1>sTARt uSINg lOCKBOx</h1>
      </Localized>
      <Localized id="firstrun-using-description">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      </Localized>

      <div className={styles.actions}>
        <Localized id="firstrun-using-guest-title">
          <h2>gUESt</h2>
        </Localized>
        <Localized id="firstrun-using-guest-action">
          <Button id="firstrun-using-guest-action"
                  theme="primary"
                  size="puffy"
                  onClick={doGuest}>gEt sTARTEd</Button>
        </Localized>
        <Localized id="firstrun-using-returning-title">
          <h2>rETURNINg</h2>
        </Localized>
        <Localized id="firstrun-using-returning-action">
          <Button id="firstrun-using-returning-action"
                  theme="ghost"
                  onClick={doReturning}>sIGn iN</Button>
        </Localized>
      </div>
    </section>
  );
}
