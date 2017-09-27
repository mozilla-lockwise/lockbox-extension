/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import Button from "../../widgets/button";

import styles from "./item-details.css";

const PASSWORD_DOT = "\u25cf";

export function Text({className, ...props}) {
  const finalClassName = `${styles.text} ${className}`.trimRight();
  return (
    <span className={finalClassName} {...props}/>
  );
}

Text.propTypes = {
  className: PropTypes.string,
};

Text.defaultProps = {
  className: "",
};

function CopyToClipboardButton({text, ...props}) {
  return (
    <CopyToClipboard text={text}>
      <Button {...props}/>
    </CopyToClipboard>
  );
}

CopyToClipboardButton.propTypes = {
  text: PropTypes.string.isRequired,
};

// Note: ItemDetails doesn't directly interact with items from the Lockbox
// datastore. For that, please consult <../containers/current-item.js>.

export default function ItemDetails({fields, onEdit, onDelete}) {
  return (
    <div className={styles.itemDetails}>
      <div className={styles.field}>
        <Localized id="item-details-title">
          <Text>tITLe</Text>
        </Localized>
        <Text data-name="title">{fields.title}</Text>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-origin">
          <Text>oRIGIn</Text>
        </Localized>
        <Text data-name="origin">{fields.origin}</Text>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-username">
          <Text>uSERNAMe</Text>
        </Localized>
        <div className={styles.inlineButton}>
          <Text data-name="username">{fields.username}</Text>
          <Localized id="item-details-copy-username">
            <CopyToClipboardButton text={fields.username}>
              cOPy
            </CopyToClipboardButton>
          </Localized>
        </div>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-password">
          <Text>pASSWORd</Text>
        </Localized>
        <div className={styles.inlineButton}>
        <Text data-name="password">
          {PASSWORD_DOT.repeat(fields.password.length)}
        </Text>
          <Localized id="item-details-copy-password">
            <CopyToClipboardButton text={fields.password}>
              cOPy
            </CopyToClipboardButton>
          </Localized>
        </div>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-notes">
          <Text>nOTEs</Text>
        </Localized>
        <Text data-name="notes">{fields.notes}</Text>
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
