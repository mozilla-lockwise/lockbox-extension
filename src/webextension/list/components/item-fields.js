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

function CopyToClipboardButton({text, field, onCopy, ...props}) {
  return (
    <CopyToClipboard text={text} onCopy={() => onCopy(field)}>
      <Button theme="ghost" className={styles.copyButton} {...props}/>
    </CopyToClipboard>
  );
}

CopyToClipboardButton.propTypes = {
  text: PropTypes.string.isRequired,
  field: PropTypes.oneOf(["username", "password"]).isRequired,
  onCopy: PropTypes.func.isRequired,
};

const fieldsPropTypes = PropTypes.shape({
  origin: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,
});

export function ItemFields({fields, onCopy}) {
  return (
    <div className={styles.itemFields}>
      <div className={styles.field}>
        <Localized id="item-fields-origin">
          <LabelText className={styles.firstLabel}>oRIGIn</LabelText>
        </Localized>
        <FieldText data-name="origin">
          {fields.origin}
        </FieldText>
      </div>
      <div className={styles.field}>
        <Localized id="item-fields-title">
          <LabelText>tITLe</LabelText>
        </Localized>
        <FieldText data-name="title">{fields.title}</FieldText>
      </div>
      <div className={styles.field}>
        <Localized id="item-fields-username">
          <LabelText>uSERNAMe</LabelText>
        </Localized>
        <div className={styles.inlineButton}>
          <FieldText monospace data-name="username">
            {fields.username}
          </FieldText>
          <Localized id="item-fields-copy-username">
            <CopyToClipboardButton text={fields.username} field="username"
                                   onCopy={onCopy}>
              cOPy
            </CopyToClipboardButton>
          </Localized>
        </div>
      </div>
      <div className={styles.field}>
        <Localized id="item-fields-password">
          <LabelText>pASSWORd</LabelText>
        </Localized>
        <div className={styles.inlineButton}>
          <FieldText monospace data-name="password">
            {PASSWORD_DOT.repeat(fields.password.length)}
          </FieldText>
          <Localized id="item-fields-copy-password">
            <CopyToClipboardButton text={fields.password} field="password"
                                   onCopy={onCopy}>
              cOPy
            </CopyToClipboardButton>
          </Localized>
        </div>
      </div>
      <div className={styles.field}>
        <Localized id="item-fields-notes">
          <LabelText>nOTEs</LabelText>
        </Localized>
        <FieldText data-name="notes">{fields.notes}</FieldText>
      </div>
    </div>
  );
}

ItemFields.propTypes = {
  fields: fieldsPropTypes,
  onCopy: PropTypes.func.isRequired,
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
          <Localized id="item-fields-origin">
            <LabelText className={styles.firstLabel}>oRIGIn</LabelText>
          </Localized>
          <Localized id="item-fields-origin-input">
            <Input type="text"
                   placeholder="wWw.eXAMPLe.cOm"
                   ref={(element) => this._firstField = element}
                   {...controlledProps("origin")}/>
          </Localized>
        </label>
        <label>
          <Localized id="item-fields-title">
            <LabelText>tITLe</LabelText>
          </Localized>
          <Localized id="item-fields-title-input">
            <Input type="text" {...controlledProps("title")}
                   placeholder="eNTRy nAMe"/>
          </Localized>
        </label>
        <label>
          <Localized id="item-fields-username">
            <LabelText>uSERNAMe</LabelText>
          </Localized>
          <Localized id="item-fields-username-input">
            <Input type="text" monospace
                   placeholder="nAMe@eXAMPLe.cOm"
                   {...controlledProps("username")}/>
          </Localized>
        </label>
        <label>
          <Localized id="item-fields-password">
            <LabelText>pASSWORd</LabelText>
          </Localized>
          <PasswordInput {...controlledProps("password")}/>
        </label>
        <label>
          <Localized id="item-fields-notes">
            <LabelText>nOTEs</LabelText>
          </Localized>
          <Localized id="item-fields-notes-input">
            <TextArea {...controlledProps("notes", 10000)}/>
          </Localized>
        </label>
      </div>
    );
  }
}
