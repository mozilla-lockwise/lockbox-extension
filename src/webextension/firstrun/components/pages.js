/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import PasswordInput from "../../widgets/password-input";
import WizardPage from "./wizard-page";
import * as telemetry from "../../telemetry.js";


export class WelcomePage1 extends React.Component {
  static get propTypes() {
    return {
      next: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  async signIn() {
    try {
      const response = await browser.runtime.sendMessage({
        type: "signin",
        interactive: true,
      });
      this.props.next(response);
    } catch (err) {
      console.log(`signin failure: ${err.message}`);
      // TODO: Localize this!
      this.setState({
        error: "Firefox Accounts login failed",
      });
    }
    telemetry.recordEvent("lockbox", "render", "signIn_page");
  }

  render() {
    const { error } = this.state;

    return (
      <Localized id="welcome-page">
        <WizardPage title="wELCOMe to lOCKBOx" submitLabel="sIGNIn"
                    onSubmit={() => this.signIn()}>
          <Localized id="welcome-page-description">
            <p>to gEt sTARTEd, sIGn up (or sIGn in) to fIREFOx aCCOUNTs</p>
          </Localized>
          <div className="error">{error}</div>
        </WizardPage>
      </Localized>
    );
  }

}

export class VerifyPage2 extends React.Component {
  static get propTypes() {
    return {
      next: PropTypes.func.isRequired,
      email: PropTypes.string.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      password: "",
    };
  }

  async initialize() {
    const email = this.props.email;
    const password = this.state.password;
    try {
      await browser.runtime.sendMessage({
        type: "initialize",
        email,
        password,
      });
      this.props.next({ password });
    } catch (err) {
      console.log(`verify failed: ${err.message}`);
      // TODO: Localize this!
      this.setState({
        error: "wrong password",
      });
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { email, ...props } = this.props;
    const { error } = this.state;

    return (
      <Localized id="verify-page">
        <WizardPage title="cONFIRm yOUr lOCKBOx pASSWORd" submitLabel="vERIFy"
                    onSubmit={() => this.initialize()}>
          <Localized id="verify-page-description">
            <p>re-eNTEr yOUr fIREFOx aCCOUNTs pASSWORd to fINISh sETTINg up yOUr
               lOCKBOx!</p>
          </Localized>
          <div className="error">{error}</div>
          <Localized id="verify-page-password">
            <PasswordInput name="password" placeholder="pASSWORd"
                           value={this.state.password}
                           onChange={(e) => {
                             this.setState({password: e.target.value});
                           }}/>
          </Localized>
        </WizardPage>
      </Localized>
    );
  }
}

export class FinishedPage3 extends React.Component {
  static get propTypes() {
    return {
      next: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
  }

  async finalize() {
    browser.runtime.sendMessage({
      type: "open_view",
      name: "manage",
    });
    this.props.next();
  }

  render() {
    return (
      <Localized id="finished-page">
        <WizardPage title="dONe!" submitLabel="fINISh"
                    onSubmit={() => this.finalize()}>
          <Localized id="finished-page-description">
            <p>yOUr lOCKBOx is rEADy to uSe!</p>
          </Localized>
        </WizardPage>
      </Localized>
    );
  }
}

export default [
  WelcomePage1,
  VerifyPage2,
  FinishedPage3,
];
