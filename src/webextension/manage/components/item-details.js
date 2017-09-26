/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import Button from "../../widgets/button";

import styles from "./item-details.css";

// Note: ItemDetails doesn't directly interact with items from the Lockbox
// datastore. For that, please consult <../containers/current-item.js>.

export default function ItemDetails({fields, onEdit, onDelete}) {
  return (
    <div className={styles.itemDetails}>
      <div className={styles.field}>
        <Localized id="item-details-title">
          <span>tITLe</span>
        </Localized>
        <span data-name="title">{fields.title}</span>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-origin">
          <span>oRIGIn</span>
        </Localized>
        <span data-name="origin">{fields.origin}</span>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-username">
          <span>uSERNAMe</span>
        </Localized>
        <span data-name="username">{fields.username}</span>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-notes">
          <span>nOTEs</span>
        </Localized>
        <span data-name="notes">{fields.notes}</span>
      </div>
      <div className={styles.buttons}>
        <Localized id="item-details-edit">
          <Button onClick={() => onEdit()}>eDIt</Button>
        </Localized>
        <Localized id="item-details-delete">
          <Button onClick={() => onDelete()}>dELETe</Button>
        </Localized>
      </div>
    </div>
  );
}

ItemDetails.propTypes = {
  fields: PropTypes.shape({
    title: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
