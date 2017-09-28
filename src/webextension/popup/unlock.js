/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import ReactDOM from "react-dom";

import styles from "./unlock.css";

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
        error: "Incorrect password",
      });
    }
  }

  render() {
    let errorMessage = this.state.error || "";
    return (
      <article className={styles.unlockPrompt}>
        <h1>Unlock Lockbox</h1>
        <form onSubmit={(evt) => { evt.preventDefault(); this.attempt(evt.target); }}>
          <div className="error">{errorMessage}</div>
          <input type="password" name="password"/>
          <input type="submit" value="unlock"/>
        </form>
      </article>
    );
  }
}

ReactDOM.render(
  <UnlockPrompt />,
  document.getElementById("content")
);
