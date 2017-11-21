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
import LabelText from "../../widgets/label-text";

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
      onChange: PropTypes.func.isRequired,
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
  }

  componentDidMount() {
    this._firstField.focus();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
    this.props.onChange();
  }

  render() {
    const {newItem, onSave, onCancel} = this.props;
    const controlledProps = (name, maxLength = 500) => {
      return {name, value: this.state[name],
              onChange: (e) => this.handleChange(e),
              maxLength: maxLength.toString()};
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
          <Localized id="item-details-title-input">
            <Input type="text" {...controlledProps("title")}
                   placeholder="eNTRy nAMe"
                   ref={(element) => this._firstField = element}/>
          </Localized>
        </label>
        <label>
          <Localized id="item-details-origin">
            <LabelText>oRIGIn</LabelText>
          </Localized>
          <Localized id="item-details-origin-input">
            <Input type="text" monospace={true}
                   placeholder="wWw.eXAMPLe.cOm"
                   {...controlledProps("origin")}/>
          </Localized>
        </label>
        <label>
          <Localized id="item-details-username">
            <LabelText>uSERNAMe</LabelText>
          </Localized>
          <Localized id="item-details-username-input">
            <Input type="text" monospace={true}
                   placeholder="nAMeE@eXAMPLE.oRg"
                   {...controlledProps("username")}/>
          </Localized>
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
          <Localized id="item-details-notes-input">
            <TextArea placeholder="aNSWERs tO sECURITy..."
                      {...controlledProps("notes", 10000)}/>
          </Localized>
        </label>
        <Toolbar className={styles.buttons}>
          <Localized id={`item-details-save-${newItem ? "new" : "existing"}`}>
            <Button type="submit" theme="primary">sAVe</Button>
          </Localized>
          <Localized id="item-details-cancel">
            <Button type="button" onClick={() => onCancel()}>
              cANCEl
            </Button>
          </Localized>
        </Toolbar>
      </form>
    );
  }
}
