/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import Button from "../../../widgets/button";
import Toolbar from "../../../widgets/toolbar";
import { EditItemFields } from "../../components/item-fields";

import styles from "./item-details.css";

// Note: EditItemDetails doesn't directly interact with items from the Lockbox
// datastore. For that, please consult <../containers/current-item.js>.

export default class EditItemDetails extends React.Component {
  static get propTypes() {
    return {
      ...EditItemFields.propTypes,
      itemId: PropTypes.string,
      onSave: PropTypes.func.isRequired,
      onCancel: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      itemId: null,
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

  componentWillReceiveProps(nextProps) {
    // If we've changed the item we're editing, reset the form fields to their
    // (new) initial state.
    if (nextProps.itemId !== this.props.itemId) {
      this.setState(nextProps.fields);
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
    this.props.onChange();
  }

  render() {
    const {itemId, onSave, onCancel} = this.props;
    const newItem = itemId === null;

    return (
      <form className={`${styles.itemDetails} ${styles.editing}`}
            onSubmit={(e) => {
              e.preventDefault();
              onSave(this.state);
            }}>
        <Localized id={`item-details-heading-${newItem ? "new" : "edit"}`}>
          <h1>eDIt iTEm</h1>
        </Localized>
        <EditItemFields fields={this.state}
                        onChange={(e) => this.handleChange(e)}/>
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
