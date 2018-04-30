/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import CopyToClipboardButton from "../../widgets/copy-to-clipboard-button";
import FieldText from "../../widgets/field-text";
import Input from "../../widgets/input";
import LabelText from "../../widgets/label-text";
import PasswordInput from "../../widgets/password-input";
import TextArea from "../../widgets/text-area";

import styles from "./item-fields.css";

const PASSWORD_DOT = "\u25cf";

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
        <Localized id="item-fields-title">
          <LabelText className={styles.firstLabel}>tITLe</LabelText>
        </Localized>
        <FieldText data-name="title">{fields.title}</FieldText>
      </div>
      <div className={styles.field}>
        <Localized id="item-fields-origin">
          <LabelText>oRIGIn</LabelText>
        </Localized>
        <FieldText data-name="origin">
          {fields.origin}
        </FieldText>
      </div>
      <div className={styles.field}>
        <Localized id="item-fields-username">
          <LabelText>uSERNAMe</LabelText>
        </Localized>
        <div className={styles.inlineButton}>
          <FieldText data-name="username">
            {fields.username}
          </FieldText>
          <Localized id="item-fields-copy-username">
            <CopyToClipboardButton value={fields.username}
                                   onCopy={() => onCopy("username")}/>
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
            <CopyToClipboardButton value={fields.password}
                                   onCopy={() => onCopy("password")}/>
          </Localized>
        </div>
      </div>
      <div className={styles.field}>
        <Localized id="item-fields-notes">
          <LabelText>nOTEs</LabelText>
        </Localized>
        <FieldText className={styles.notesReadOnly} data-name="notes">
          {fields.notes}
        </FieldText>
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
          <Localized id="item-fields-title">
            <LabelText className={styles.firstLabel}>tITLe</LabelText>
          </Localized>
          <Localized id="item-fields-title-input" attrs={{placeholder: true}}>
            <Input className={styles.input} type="text" placeholder="eNTRy nAMe"
                   {...controlledProps("title")}
                   ref={(element) => this._firstField = element} />
          </Localized>
        </label>
        <label>
          <Localized id="item-fields-origin">
            <LabelText>oRIGIn</LabelText>
          </Localized>
          <Localized id="item-fields-origin-input" attrs={{placeholder: true}}>
            <Input className={styles.input} type="text"
                   placeholder="wWw.eXAMPLe.cOm"
                   {...controlledProps("origin")}/>
          </Localized>
        </label>
        <label>
          <Localized id="item-fields-username">
            <LabelText>uSERNAMe</LabelText>
          </Localized>
          <Localized id="item-fields-username-input"
                     attrs={{placeholder: true}}>
            <Input className={styles.input} type="text"
                   placeholder="nAMe@eXAMPLe.cOm"
                   {...controlledProps("username")}/>
          </Localized>
        </label>
        <label>
          <Localized id="item-fields-password">
            <LabelText>pASSWORd</LabelText>
          </Localized>
          <PasswordInput className={styles.password}
                         {...controlledProps("password")}/>
        </label>
        <label>
          <Localized id="item-fields-notes">
            <LabelText>nOTEs</LabelText>
          </Localized>
          <TextArea className={styles.notes}
                    {...controlledProps("notes", 10000)}/>
        </label>
      </div>
    );
  }
}
