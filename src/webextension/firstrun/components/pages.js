/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import PropTypes from "prop-types";

import Input from "../../widgets/input";
import WizardPage from "./wizard-page";

class WelcomePage1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static get propTypes() {
    return {
      next: PropTypes.func.isRequired,
    };
  }

  async signIn() {
    try {
      const response = await browser.runtime.sendMessage({
        type: "signin",
        interactive: true,
      });
      this.props.next(response);
    } catch (err) {
      // TODO: something with the error
      this.setState({
        error: "Firefox Accounts login failed",
      });
    }
  }

  render() {
    const { error } = this.state;

    return (
      <WizardPage title="Welcome to Lockbox" submitLabel="sIGNIn"
                  onSubmit={() => this.signIn()}>
        <p>To get started, sign up (or sign in) to Firefox Accounts</p>
        <div className="error">{error}</div>
      </WizardPage>
    );
  }
}

class VerifyPage2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static get propTypes() {
    return {
      next: PropTypes.func.isRequired,
      email: PropTypes.string.isRequired,
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
      <WizardPage title="Confirm your Lockbox Password" submitLabel="vERIFy"
                  onSubmit={() => this.initialize()}>
        <p>Re-enter your Firefox Accounts password to finish setting up your
           Lockbox!</p>
        <div className="error">{error}</div>
        <Input type="password" name="password" value={this.state.password}
               onChange={(e) => this.setState({password: e.target.value})}/>
      </WizardPage>
    );
  }
}

class FinishedPage3 extends React.Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      next: PropTypes.func.isRequired,
    };
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
      <WizardPage title="DONE!" submitLabel="fINISh"
                  onSubmit={() => this.finalize()}>
        <p>Your Lockbox is ready to use!</p>
      </WizardPage>
    );
  }
}

const pages = [
  WelcomePage1,
  VerifyPage2,
  FinishedPage3,
];
export default pages;
