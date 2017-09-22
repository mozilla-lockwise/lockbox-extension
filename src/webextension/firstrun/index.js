/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const PagePropTypes = {
  page: PropTypes.number,
  next: PropTypes.func,
};

const Page1 = ({page, next}) => {
  if (page !== 1) {
    return null;
  }

  const doSignIn = async(evt) => {
    evt.preventDefault();
    // TODO: signin!
    const response = await browser.runtime.sendMessage({
      type: "signin",
      interactive: true,
    });
    next(response);
  }

  return (
    <article>
      <h1>Welcome to Lockbox</h1>
      <p>To get started, sign up (or sign in) to Firefox Accounts</p>
      <button onClick={doSignIn}>Signin to FxA</button>
    </article>
  )
};
Page1.propTypes = {
  ...PagePropTypes,
};

const Page2 = ({page, next}) => {
  if (page !== 2) {
    return null;
  }

  const doSubmit = async(evt) => {
    evt.preventDefault();
    let password = evt.target.elements.password.value || "";
    await browser.runtime.sendMessage({
      type: "initialize",
      password,
    });
    next({ password });
  };

  return (
    <article>
      <h1>Confirm your Password</h1>
      <p>Re-enter your Firefox Accounts password to unlock your Lockbox</p>
      <form onSubmit={doSubmit}>
        <input type="password" name="password" />
        <input type="submit" value="CHECK" />
      </form>
    </article>
  );
};
Page2.propTypes = {
  ...PagePropTypes,
};

const Page3 = ({page, next}) => {
  if (page !== 3) {
    return null;
  }

  const doEditor = (evt) => {
    evt.preventDefault();
    browser.runtime.sendMessage({
      type: "open_view",
      name: "manage",
    });
    next();
  };

  return (
    <article>
      <h1>DONE!</h1>
      <p>Your lockbox is ready to use!</p>
      <button onClick={doEditor}>Open Editor</button>
    </article>
  )
};
Page3.propTypes = {
  ...PagePropTypes,
};

class Wizard extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 1,
    };

    this.next = this.next.bind(this);
    console.log("Created the wizard!");
  }

  async next(state = {}) {
    let { page } = this.state;
    page++;

    state = {
      ...this.state,
      ...state,
      page,
    };

    if (page > 3) {
      console.log("closing the welcome wagon ...");
      browser.runtime.sendMessage({
        type: "close_view",
        name: "firstrun",
      });
    }
    this.setState(state);
  }

  render() {
    const current = this.state.page;
    return (
      <section>
        <Page1 page={current} next={this.next} />
        <Page2 page={current} next={this.next} />
        <Page3 page={current} next={this.next}/>
      </section>
    );
  }
}

ReactDOM.render(
  <Wizard/>,
  document.getElementById("content")
);
