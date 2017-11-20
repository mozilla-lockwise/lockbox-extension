/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import Button from "../../widgets/button";
import FieldText from "../../widgets/field-text";
import Input from "../../widgets/input";
import LabelText from "../../widgets/label-text";
import PasswordInput from "../../widgets/password-input";
import TextArea from "../../widgets/text-area";

import styles from "./item-fields.css";

const PASSWORD_DOT = "\u25cf";

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

const fieldsPropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,
});

export function ItemFields({fields}) {
  return (
    <div className={styles.itemFields}>
      <div className={styles.field}>
        <Localized id="item-details-title">
          <LabelText className={styles.firstLabel}>tITLe</LabelText>
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
    </div>
  );
}

ItemFields.propTypes = {
  fields: fieldsPropTypes,
};

export class EditItemFields extends React.Component {
  static get propTypes() {
    return {
      fields: fieldsPropTypes.isRequired,
      onChange: PropTypes.func.isRequired,
    };
  }

  componentDidMount() {
    this._firstField.focus();
  }

  render() {
    const {fields, onChange} = this.props;
    const controlledProps = (name, maxLength = 500) => {
      return {name, value: fields[name],
              onChange: (e) => onChange(e),
              maxLength: maxLength.toString()};
    };

    return (
      <div className={styles.itemFields}>
        <label>
          <Localized id="item-details-title">
            <LabelText className={styles.firstLabel}>tITLe</LabelText>
          </Localized>
          <Input type="text" {...controlledProps("title")}
                 placeholder="eNTRy nAMe"
                 ref={(element) => this._firstField = element}/>
        </label>
        <label>
          <Localized id="item-details-origin">
            <LabelText>oRIGIn</LabelText>
          </Localized>
          <Input type="text" monospace={true}
                 placeholder="wWw.eXAMPLe.cOm"
                 {...controlledProps("origin")}/>
        </label>
        <label>
          <Localized id="item-details-username">
            <LabelText>uSERNAMe</LabelText>
          </Localized>
          <Input type="text" monospace={true}
                 placeholder="nAMe@eXAMPLe.cOm"
                 {...controlledProps("username")}/>
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
          <TextArea placeholder="aNSWERs to sECURITy..."
                    {...controlledProps("notes", 10000)}/>
        </label>
      </div>
    );
  }
}
