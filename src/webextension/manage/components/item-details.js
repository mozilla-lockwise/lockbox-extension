/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import Button from "../../widgets/button";
import FieldText from "../../widgets/field-text";
import LabelText from "../../widgets/label-text";
import Toolbar from "../../widgets/toolbar";

import styles from "./item-details.css";

import * as telemetry from "../../telemetry";

const PASSWORD_DOT = "\u25cf";

function CopyToClipboardButton({text, ...props}) {
  telemetry.recordEvent("itemCopied", "entryDetails");
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
      <Localized id={"item-details-heading-view"}>
        <h1>eDIt iTEm</h1>
      </Localized>
      <div className={styles.field}>
        <Localized id="item-details-title">
          <LabelText>tITLe</LabelText>
        </Localized>
        <FieldText data-name="title">{fields.title}</FieldText>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-origin">
          <LabelText>oRIGIn</LabelText>
        </Localized>
        <FieldText monospace={true} data-name="origin">
          {fields.origin}
        </FieldText>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-username">
          <LabelText>uSERNAMe</LabelText>
        </Localized>
        <div className={styles.inlineButton}>
          <FieldText monospace={true} data-name="username">
            {fields.username}
          </FieldText>
          <Localized id="item-details-copy-username">
            <CopyToClipboardButton text={fields.username}>
              cOPy
            </CopyToClipboardButton>
          </Localized>
        </div>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-password">
          <LabelText>pASSWORd</LabelText>
        </Localized>
        <div className={styles.inlineButton}>
          <FieldText monospace={true} data-name="password">
            {PASSWORD_DOT.repeat(fields.password.length)}
          </FieldText>
          <Localized id="item-details-copy-password">
            <CopyToClipboardButton text={fields.password}>
              cOPy
            </CopyToClipboardButton>
          </Localized>
        </div>
      </div>
      <div className={styles.field}>
        <Localized id="item-details-notes">
          <LabelText>nOTEs</LabelText>
        </Localized>
        <FieldText data-name="notes">{fields.notes}</FieldText>
      </div>
      <Toolbar className={styles.buttons}>
        <Localized id="item-details-edit">
          <Button onClick={() => onEdit()}>eDIt</Button>
        </Localized>
        <Localized id="item-details-delete">
          <Button theme="ghost" onClick={() => onDelete()}>dELETe</Button>
        </Localized>
      </Toolbar>
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
