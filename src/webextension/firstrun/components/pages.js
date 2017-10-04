/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import PropTypes from "prop-types";

import Input from "../../widgets/input";
import Button from "../../widgets/button";

const PagePropTypes = {
  page: PropTypes.number,
  next: PropTypes.func,
};

class WelcomePage1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static get propTypes() {
    return PagePropTypes;
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
        ...this.state,
        error: "Firefox Accounts login failed",
      });
    }
  }

  render() {
    const { error } = this.state;

    const onSignIn = (evt) => {
      evt.preventDefault();
      this.signIn();
    };

    return (
      <article>
        <h1>Welcome to Lockbox</h1>
        <p>To get started, sign up (or sign in) to Firefox Accounts</p>
        <div className="error">{error}</div>
        <Button onClick={onSignIn}>sIGNIn</Button>
      </article>
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
      ...PagePropTypes,
      email: PropTypes.string,
    };
  }

  async initialize(password) {
    let email = this.props.email || "";
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
    const { error } = this.state;

    const onSubmit = (evt) => {
      evt.preventDefault();
      let password = evt.target.elements.password.value || "";
      this.initialize(password);
    };

    return (
      <article>
        <h1>Confirm your Lockbox Password</h1>
        <p>Re-enter your Firefox Accounts password to finish setting up your Lockbox!</p>
        <div className="error">{error}</div>
        <form onSubmit={onSubmit}>
          <Input type="password" name="password" />
          <Button type="submit">vERIFy</Button>
        </form>
      </article>
    );
  }
}

class FinishedPage3 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static get propTypes() {
    return PagePropTypes;
  }

  async finalize() {
    browser.runtime.sendMessage({
      type: "open_view",
      name: "manage",
    });
    this.props.next();
  }

  render() {
    const onClick = (evt) => {
      evt.preventDefault();
      this.finalize();
    };

    return (
      <article>
        <h1>DONE!</h1>
        <p>Your Lockbox is ready to use!</p>
        <Button onClick={onClick}>fINISh</Button>
      </article>
    );
  }
}

const pages = [
  WelcomePage1,
  VerifyPage2,
  FinishedPage3,
];
export default pages;
