/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";

import styles from "./itemDetails.css";

export default class ItemDetails extends React.Component {
  static get propTypes() {
    return {
      item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
      }),
      onSave: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
    };
  }

  _setState(props, initial) {
    let state;
    if (props.item) {
      state = {...props.item};
    } else {
      state = {id: undefined, title: "", username: "", password: ""};
    }

    this.newItem = !props.item;
    if (initial) {
      this.state = state;
    } else {
      this.setState(state);
    }
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
      <form className={styles.itemDetails} onSubmit={(e) => {
        e.preventDefault();
        onSave(this.state);
      }}>
        <p>
          <Localized id="item-site">
            <span>sITe</span>
          </Localized>
          <input type="text" value={this.state.title}
                 onChange={(e) => this.setState({title: e.target.value})}/>
        </p>
        <p>
          <Localized id="item-username">
            <span>uSERNAMe</span>
          </Localized>
          <input type="text" value={this.state.username}
                 onChange={(e) => this.setState({username: e.target.value})}/>
        </p>
        <p>
          <Localized id="item-password">
            <span>pASSWORd</span>
          </Localized>
          <input type="text" value={this.state.password}
                 onChange={(e) => this.setState({password: e.target.value})}/>
        </p>
        <p>
          <Localized id={this.newItem ? "save-item" : "update-item"}>
            <button type="submit">sAVe</button>
          </Localized>
          <Localized id={this.newItem ? "cancel-item" : "delete-item"}>
            <button type="button"
                    onClick={(e) => onDelete(this.state.id)}>dELETe</button>
          </Localized>
        </p>
      </form>
    );
  }
}
