/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../widgets/button";
import * as telemetry from "../../telemetry";

import styles from "./app.css";

export default function App() {
  const imgSrc = browser.extension.getURL("/images/nessie_v2.svg");

  const doSignIn = async () => {
    telemetry.recordEvent("click", "unlockSignin");
    browser.runtime.sendMessage({
      type: "signin",
      view: "manage",
    });
  };
  const doPrefs = async () => {
    browser.runtime.openOptionsPage();
    window.close();
  };

  return (
    <article className={styles.unlock}>
      <img src={imgSrc} alt="" />
      <section className={styles.content}>
        <Localized id="unlock-title">
          <h1>lOCKBOx</h1>
        </Localized>
        <Localized id="unlock-tagline">
          <h2>lOCKBOx tAGLINe</h2>
        </Localized>
      </section>
      <menu>
        <Localized id="unlock-action-signin">
          <Button size="puffy"
                  theme="primary"
                  onClick={doSignIn}>sIGn iN</Button>
        </Localized>
        <Localized id="unlock-action-prefs">
          <Button size="puffy"
                  onClick={doPrefs}>pREFs</Button>
        </Localized>
      </menu>
    </article>
  );
}
