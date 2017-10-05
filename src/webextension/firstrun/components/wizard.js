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

  async next(nextState = {}) {
    let { page } = this.state;
    page++;

    if (page >= Pages.length) {
      browser.runtime.sendMessage({
        type: "close_view",
        name: "firstrun",
      });
    }

    this.setState({
      ...this.state,
      ...nextState,
      page,
    });
  }

  render() {
    const { page, ...state } = this.state;
    const CurrentPage = Pages[page];
    return (
      <section>
        <CurrentPage {...state} next={this.next}/>
      </section>
    );
  }
}
