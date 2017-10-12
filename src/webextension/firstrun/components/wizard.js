/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./wizard.css";

export default class Wizard extends React.Component {
  static get propTypes() {
    return {
      pages: PropTypes.array.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      pageIndex: 0,
    };
    this.next = this.next.bind(this);
  }

  next(nextState = {}) {
    const { pages } = this.props;
    let { pageIndex } = this.state;
    pageIndex++;

    if (pageIndex >= pages.length) {
      browser.runtime.sendMessage({
        type: "close_view",
        name: "firstrun",
      });
    }

    this.setState({
      ...this.state,
      ...nextState,
      pageIndex,
    });
  }

  render() {
    const { pages } = this.props;
    const { pageIndex, ...state } = this.state;
    const CurrentPage = pages[pageIndex];
    if (CurrentPage === undefined) {
      return null;
    }

    return (
      <section className={styles.wizard}>
        <CurrentPage {...state} next={this.next}/>
      </section>
    );
  }
}
