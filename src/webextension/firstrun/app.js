/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import React from "react";

import Pages from "./pages";

export default class Wizard extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 0,
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

    if (page >= Pages.length) {
      browser.runtime.sendMessage({
        type: "close_view",
        name: "firstrun",
      });
    }
    this.setState(state);
  }

  render() {
    const CurrentPage = Pages[this.state.page];
    return (
      <section>
        <CurrentPage {...this.state} next={this.next} />
      </section>
    );
  }
}
