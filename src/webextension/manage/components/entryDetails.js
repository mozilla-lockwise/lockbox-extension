/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";

export default class EntryDetails extends React.Component {
  propTypes: {
    site: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    id: PropTypes.number,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(props) {
    this.setState({
      site: props.site,
      username: props.username,
      password: props.password,
    });
  }

  render() {
    const {id, onSave, onDelete} = this.props;

    // XXX: This probably belongs somewhere else!
    if (id === null) {
      return (
        <Localized id="no-entry">
          <div style={{margin: "1em"}}>no eNTRy sELECTEd</div>
        </Localized>
      );
    }

    return (
      <div style={{margin: "1em"}}>
        <p>
          <Localized id="entry-site">
            <span>sITe</span>
          </Localized>
          <input type="text" value={this.state.site}
                 onChange={(e) => this.setState({site: e.target.value})}/>
        </p>
        <p>
          <Localized id="entry-username">
            <span>uUSERNAMe</span>
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
          <Localized id="save-entry">
            <button onClick={() => onSave(id, this.state)}>sAVe</button>
          </Localized>
          <Localized id="delete-entry">
            <button onClick={() => onDelete(id)}>dELETe</button>
          </Localized>
        </p>
      </div>
    );
  }
}
