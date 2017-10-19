/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import Button from "../../widgets/button";
import Input from "../../widgets/input";
import PasswordInput from "../../widgets/password-input";
import TextArea from "../../widgets/text-area";
import Toolbar from "../../widgets/toolbar";
import { LabelText } from "./item-details.js";

import styles from "./item-details.css";

// Note: EditItemDetails doesn't directly interact with items from the Lockbox
// datastore. For that, please consult <../containers/current-item.js>.

export default class EditItemDetails extends React.Component {
  static get propTypes() {
    return {
      newItem: PropTypes.bool,
      fields: PropTypes.shape({
        title: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        notes: PropTypes.string.isRequired,
      }),
      onSave: PropTypes.func.isRequired,
      onCancel: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      newItem: false,
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
    this._changed = false;
  }

  componentDidMount() {
    this._firstField.focus();
  }

  handleChange(event) {
    this._changed = true;
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    const {newItem, onSave, onCancel} = this.props;
    const controlledProps = (name) => {
      return {name, value: this.state[name],
              onChange: (e) => this.handleChange(e)};
    };

    return (
      <form className={`${styles.itemDetails} ${styles.editing}`}
            onSubmit={(e) => {
              e.preventDefault();
              onSave(this.state);
            }}>
        <Localized id={`item-details-heading-${newItem ? "new" : "edit"}`}>
          <h1>eDIt iTEm</h1>
        </Localized>
        <label>
          <Localized id="item-details-title">
            <LabelText>tITLe</LabelText>
          </Localized>
          <Input type="text" {...controlledProps("title")}
                 ref={(element) => this._firstField = element}/>
        </label>
        <label>
          <Localized id="item-details-origin">
            <LabelText>oRIGIn</LabelText>
          </Localized>
          <Input type="text" {...controlledProps("origin")}/>
        </label>
        <label>
          <Localized id="item-details-username">
            <LabelText>uSERNAMe</LabelText>
          </Localized>
          <Input type="text" {...controlledProps("username")}/>
        </label>
        <label>
          <Localized id="item-details-password">
            <LabelText>pASSWORd</LabelText>
          </Localized>
          <PasswordInput {...controlledProps("password")}/>
        </label>
        <label>
          <Localized id="item-details-notes">
            <LabelText>nOTEs</LabelText>
          </Localized>
          <TextArea {...controlledProps("notes")}/>
        </label>
        <Toolbar className={styles.buttons}>
          <Localized id={`item-details-save-${newItem ? "new" : "existing"}`}>
            <Button className="default" type="submit">sAVe</Button>
          </Localized>
          <Localized id="item-details-cancel">
            <Button type="button" onClick={(e) => onCancel(this._changed)}>
              cANCEl
            </Button>
          </Localized>
        </Toolbar>
      </form>
    );
  }
}
