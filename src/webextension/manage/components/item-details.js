/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import Button from "../../widgets/button";
import Input from "../../widgets/input";

import styles from "./item-details.css";

// Note: ItemDetails doesn't directly interact with items from the Lockbox
// datastore. For that, please consult <../containers/currentItem.js>.

export default class ItemDetails extends React.Component {
  static get propTypes() {
    return {
      fields: PropTypes.shape({
        title: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
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
        username: "",
        password: "",
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
        <p>
          <Localized id="item-site">
            <span>sITe</span>
          </Localized>
          <Input type="text" value={this.state.title}
                 onChange={(e) => this.setState({title: e.target.value})}/>
        </p>
        <p>
          <Localized id="item-username">
            <span>uSERNAMe</span>
          </Localized>
          <Input type="text" value={this.state.username}
                 onChange={(e) => this.setState({username: e.target.value})}/>
        </p>
        <p>
          <Localized id="item-password">
            <span>pASSWORd</span>
          </Localized>
          <Input type="text" value={this.state.password}
                 onChange={(e) => this.setState({password: e.target.value})}/>
        </p>
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
