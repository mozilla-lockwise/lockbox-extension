/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../../widgets/button";
import ErrorMessage from "../../../widgets/error-message";
import PasswordInput from "../../../widgets/password-input";

import styles from "./unlock-prompt.css";

export default class UnlockPrompt extends React.Component {
  constructor() {
    super();
    this.state = {
      error: "",
      password: "",
    };
  }

  async attempt() {
    const { password } = this.state;

    try {
      await browser.runtime.sendMessage({
        type: "unlock",
        password,
      });
      await browser.runtime.sendMessage({
        type: "open_view",
        name: "manage",
      });
      window.close();
    } catch (err) {
      this.setState({
        error: "unlock-prompt-err-invalid-pwd",
      });
    }
  }

  componentDidMount() {
    this._passwordField.focus();
  }

  handlePasswordChange(value) {
    this.setState({
      error: "",
      password: value,
    });
  }

  render() {
    const { error } = this.state;

    // XXX: It might be worth splitting this up and Redux-ifying this view so
    // that each component is as simple as possible.
    return (
      <article className={styles.unlockPrompt}>
        <form onSubmit={(e) => {
          e.preventDefault();
          this.attempt();
        }}>
          <Localized id="unlock-prompt-title">
            <h1>uNLOCk yOUr lOCKBOx</h1>
          </Localized>
          <p>
            <ErrorMessage code={error}/>
          </p>
          <Localized id="unlock-prompt-desc">
            <p>eNTEr yOUr mASTEr pASSWORd to uNLOCk:</p>
          </Localized>
          <PasswordInput className={styles.passwordInput}
                         name="password" value={this.state.password}
                         onChange={(e) => {
                           this.handlePasswordChange(e.target.value);
                         }}
                         ref={(element) => this._passwordField = element}/>
          <Localized id="unlock-prompt-submit">
            <Button type="submit">uNLOCk</Button>
          </Localized>
        </form>
      </article>
    );
  }
}
