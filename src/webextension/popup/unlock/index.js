/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";
import ReactDOM from "react-dom";

import AppLocalizationProvider from "../../l10n";
import Button from "../../widgets/button";
import ErrorMessage from "../../widgets/error-message";
import Input from "../../widgets/input";
import styles from "./index.css";

class UnlockPrompt extends React.Component {
  constructor() {
    super();
    this.state = { error: "" };
  }

  async attempt(form) {
    let password = form.elements.password.value || "";

    try {
      await browser.runtime.sendMessage({
        type: "unlock",
        password,
      }).
      then(() => {
        return browser.runtime.sendMessage({
          type: "open_view",
          name: "manage",
        });
      });
      window.close();
    } catch (err) {
      this.setState({
        error: "unlock-prompt-err-invalid-pwd",
      });
    }
  }

  render() {
    const errorCode = this.state.error || "";

    return (
      <article className={styles.unlockPrompt}>
        <form onSubmit={(evt) => { evt.preventDefault(); this.attempt(evt.target); }}>
          <Localized id="unlock-prompt-title">
            <h1>....</h1>
          </Localized>
          <p>
            <ErrorMessage code={errorCode} />
          </p>
          <Localized id="unlock-prompt-desc">
            <p>do it now!</p>
          </Localized>
          <Input type="password" name="password"
                 onInput={ (evt) => this.setState({ error: "" }) }/>
          <Localized id="unlock-prompt-submit">
            <Button type="submit">uNLOCk</Button>
          </Localized>
        </form>
      </article>
    );
  }
}

ReactDOM.render(
  <AppLocalizationProvider bundles={["popup", "widgets"]}
                           userLocales={navigator.languages}>
    <UnlockPrompt />
  </AppLocalizationProvider>,
  document.getElementById("content")
);
