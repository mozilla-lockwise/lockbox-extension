/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import Button from "../../widgets/button";
import Input from "../../widgets/input";
import TextArea from "../../widgets/text-area";

import styles from "./item-details.css";

// Note: ItemDetails doesn't directly interact with items from the Lockbox
// datastore. For that, please consult <../containers/currentItem.js>.

export default class ItemDetails extends React.Component {
  static get propTypes() {
    return {
      fields: PropTypes.shape({
        title: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        notes: PropTypes.string.isRequired,
      }),
      saveLabel: PropTypes.string.isRequired,
      deleteLabel: PropTypes.string.isRequired,
      onSave: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      fields: {
        title: "",
        origin: "",
        username: "",
        password: "",
        notes: "",
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {...props.fields};
  }

  componentWillReceiveProps(props) {
    this.setState({...props.fields});
  }

  render() {
    const {saveLabel, deleteLabel, onSave, onDelete} = this.props;

    return (
      <form className={styles.itemDetails} onSubmit={(e) => {
        e.preventDefault();
        onSave(this.state);
      }}>
        <label>
          <Localized id="item-details-title">
            <span>tITLe</span>
          </Localized>
          <Input type="text" name="title" value={this.state.title}
                 onChange={(e) => this.setState({title: e.target.value})}/>
        </label>
        <label>
          <Localized id="item-details-origin">
            <span>oRIGIn</span>
          </Localized>
          <Input type="text" name="origin" value={this.state.origin}
                 onChange={(e) => this.setState({origin: e.target.value})}/>
        </label>
        <label>
          <Localized id="item-details-username">
            <span>uSERNAMe</span>
          </Localized>
          <Input type="text" name="username" value={this.state.username}
                 onChange={(e) => this.setState({username: e.target.value})}/>
        </label>
        <label>
          <Localized id="item-details-password">
            <span>pASSWORd</span>
          </Localized>
          <Input type="text" name="password" value={this.state.password}
                 onChange={(e) => this.setState({password: e.target.value})}/>
        </label>
        <label>
          <Localized id="item-details-notes">
            <span>nOTEs</span>
          </Localized>
          <TextArea name="notes" value={this.state.notes}
                    onChange={(e) => this.setState({notes: e.target.value})}/>
        </label>
        <p></p>
        <p>
          <Localized id={saveLabel}>
            <Button type="submit">sAVe</Button>
          </Localized>
          <Localized id={deleteLabel}>
            <Button type="button" onClick={(e) => onDelete(this.state.id)}>
              dELETe
            </Button>
          </Localized>
        </p>
      </form>
    );
  }
}
