/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";

import styles from "./entryDetails.css";

export default class EntryDetails extends React.Component {
  static get propTypes() {
    return {
      entry: PropTypes.shape({
        id: PropTypes.number.isRequired,
        site: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
      }),
      onSave: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
    };
  }

  _setState(props, initial) {
    let state;
    if (props.entry)
      state = {...props.entry};
    else
      state = {id: undefined, site: "", username: "", password: ""};

    this.newEntry = !props.entry;
    if (initial)
      this.state = state;
    else
      this.setState(state);
  }

  constructor(props) {
    super(props);
    this._setState(props, true);
  }

  componentWillReceiveProps(props) {
    this._setState(props, false);
  }

  render() {
    const {onSave, onDelete} = this.props;

    return (
      <form className={styles.entryDetails} onSubmit={(e) => {
        e.preventDefault();
        onSave(this.state);
      }}>
        <p>
          <Localized id="entry-site">
            <span>sITe</span>
          </Localized>
          <input type="text" value={this.state.site}
                 onChange={(e) => this.setState({site: e.target.value})}/>
        </p>
        <p>
          <Localized id="entry-username">
            <span>uSERNAMe</span>
          </Localized>
          <input type="text" value={this.state.username}
                 onChange={(e) => this.setState({username: e.target.value})}/>
        </p>
        <p>
          <Localized id="entry-password">
            <span>pASSWORd</span>
          </Localized>
          <input type="text" value={this.state.password}
                 onChange={(e) => this.setState({password: e.target.value})}/>
        </p>
        <p>
          <Localized id={this.newEntry ? "save-entry" : "update-entry"}>
            <button type="submit">sAVe</button>
          </Localized>
          <Localized id={this.newEntry ? "cancel-entry" : "delete-entry"}>
            <button onClick={() => onDelete(this.state.id)}>dELETe</button>
          </Localized>
        </p>
      </form>
    );
  }
}
