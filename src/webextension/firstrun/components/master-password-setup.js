/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../widgets/button";
import PasswordInput from "../../widgets/password-input";
import * as telemetry from "../../telemetry";

import styles from "./master-password-setup.css";

export default class MasterPasswordSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      confirmPassword: "",
    };
  }

  componentDidMount() {
    this._firstField.focus();
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      error: undefined,
    });
  }

  async handleSubmit() {
    let { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      // TODO: Localize this!
      this.setState({
        error: "Passwords do not match",
      });
    } else {
      try {
        await browser.runtime.sendMessage({
          type: "signin",
          interactive: false,
        });
        await browser.runtime.sendMessage({
          type: "initialize",
          password,
        });

        telemetry.recordEvent("lockbox", "click", "setupDoneButton");

        await browser.runtime.sendMessage({
          type: "open_view",
          name: "manage",
        });
        await browser.runtime.sendMessage({
          type: "close_view",
          name: "firstrun",
        });
      } catch (err) {
        console.log(`initialize failed: ${err.message}`);
        // TODO: Localize this!
        this.setState({
          error: "Could not initialize!",
        });
      }
    }
  }

  render() {
    const { error = "\u00a0" } = this.state;
    const controlledProps = (name) => {
      return {name, value: this.state[name],
              onChange: (e) => this.handleChange(e)};
    };

    return (
      <form className={styles.masterPasswordSetup}
            onSubmit={(evt) => { evt.preventDefault(); this.handleSubmit(); }}>
        <Localized id="master-password-setup-formtitle">
          <h3>eNTEr mASTEr pASSWORd</h3>
        </Localized>
        <label>
          <Localized id="master-password-setup-password">
            <div>pASSWORd</div>
          </Localized>
          <PasswordInput {...controlledProps("password")}
                         ref={(element) => this._firstField = element}/>
        </label>
        <label>
          <Localized id="master-password-setup-confirm">
            <div>cONFIRm pASSWORd</div>
          </Localized>
          <PasswordInput {...controlledProps("confirmPassword")}/>
        </label>
        <div className={styles.error}>{error}</div>
        <Localized id="master-password-setup-submit">
          <Button theme="primary" type="submit">iNIt</Button>
        </Localized>
      </form>
    );
  }
}
