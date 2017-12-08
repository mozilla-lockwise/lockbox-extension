/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../widgets/button";
import * as telemetry from "../../telemetry";

import styles from "./using.css";

export default function StartUsing() {
  const doGuest = async () => {
    telemetry.recordEvent("click", "welcomeGuest");
    browser.runtime.sendMessage({
      type: "initialize",
      view: "manage",
    });
    browser.runtime.sendMessage({
      type: "close_view",
      name: "firstrun",
    });
  };
  const doReturning = async () => {
    telemetry.recordEvent("click", "welcomeSignin");
    browser.runtime.sendMessage({
      type: "upgrade_account",
      view: "manage",
    });
    browser.runtime.sendMessage({
      type: "close_view",
      name: "firstrun",
    });
  };

  return (
    <section className={styles.using}>
      <div className={styles.actions}>
        <Localized id="firstrun-using-guest-title">
          <h2>gUESt</h2>
        </Localized>
        <Localized id="firstrun-using-guest-action">
          <Button theme="primary"
                  size="puffy"
                  onClick={doGuest}>gEt sTARTEd</Button>
        </Localized>
        <Localized id="firstrun-using-returning-title">
          <h2>rETURNINg</h2>
        </Localized>
        <Localized id="firstrun-using-returning-action">
          <Button theme="link" className="external"
                  onClick={doReturning}>sIGn iN</Button>
        </Localized>
      </div>
    </section>
  );
}
