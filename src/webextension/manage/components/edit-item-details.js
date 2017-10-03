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
import { Text } from "./item-details.js";

import styles from "./item-details.css";

// Note: EditItemDetails doesn't directly interact with items from the Lockbox
// datastore. For that, please consult <../containers/current-item.js>.

export default class EditItemDetails extends React.Component {
  static get propTypes() {
    return {
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

  componentWillReceiveProps(props) {
    this.setState({...props.fields});
  }

  render() {
    const {onSave, onCancel} = this.props;
    const controlledProps = (name) => {
      return {name, value: this.state[name],
              onChange: (e) => this.setState({[name]: e.target.value})};
    };

    return (
      <form className={`${styles.itemDetails} ${styles.editing}`}
            onSubmit={(e) => {
              e.preventDefault();
              onSave(this.state);
            }}>
        <label>
          <Localized id="item-details-title">
            <Text>tITLe</Text>
          </Localized>
        <Input type="text" {...controlledProps("title")}
               ref={(element) => this._firstField = element}/>
        </label>
        <label>
          <Localized id="item-details-origin">
            <Text>oRIGIn</Text>
          </Localized>
          <Input type="text" {...controlledProps("origin")}/>
        </label>
        <label>
          <Localized id="item-details-username">
            <Text>uSERNAMe</Text>
          </Localized>
          <Input type="text" {...controlledProps("username")}/>
        </label>
        <label>
          <Localized id="item-details-password">
            <Text>pASSWORd</Text>
          </Localized>
          <PasswordInput {...controlledProps("password")}/>
        </label>
        <label>
          <Localized id="item-details-notes">
            <Text>nOTEs</Text>
          </Localized>
          <TextArea {...controlledProps("notes")}/>
        </label>
        <div className={styles.buttons}>
          <Localized id="item-details-save">
            <Button type="submit">sAVe</Button>
          </Localized>
          <Localized id="item-details-cancel">
            <Button type="button" onClick={(e) => onCancel()}>
              cANCEl
            </Button>
          </Localized>
        </div>
      </form>
    );
  }
}
