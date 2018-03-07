/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import { NEW_ITEM_ID } from "../common";
import CopyToClipboardButton from "../../widgets/copy-to-clipboard-button";

import styles from "./item-summary.css";

function ItemSummaryCopyButtons() {
  return (
    <div className={styles.verbose}
         onMouseDown={(e) => e.stopPropagation()}>
      <Localized id="item-summary-copy-username">
        <CopyToClipboardButton className={styles.copyButton}
                               buttonClassName={styles.copyButtonInner}
                               value="later">
          cOPy uSERNAMe
        </CopyToClipboardButton>
      </Localized>
      <Localized id="item-summary-copy-password">
        <CopyToClipboardButton className={styles.copyButton}
                               buttonClassName={styles.copyButtonInner}
                               value="sorry">
          cOPy pASSWORd
        </CopyToClipboardButton>
      </Localized>
    </div>
  );
}

export default function ItemSummary({id, title, username, verbose}) {
  title = title.trim();
  username = username.trim();

  const idModifier = id === NEW_ITEM_ID ? "new-" : "";
  const titleId = `item-summary-${idModifier}title`;
  const usernameId = `item-summary-${idModifier}username`;
  return (
    <div>
      <div className={styles.itemSummary}>
        <Localized id={titleId} $title={title} $length={title.length}>
          <div className={styles.title}>no tITLe</div>
        </Localized>
        <Localized id={usernameId} $username={username}
                   $length={username.length}>
          <div className={styles.subtitle}>no uSERNAMe</div>
        </Localized>
      </div>
      {verbose && <ItemSummaryCopyButtons/>}
    </div>
  );
}

ItemSummary.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  username: PropTypes.string,
  verbose: PropTypes.bool,
};

ItemSummary.defaultProps = {
  id: null,
  title: "",
  username: "",
  verbose: false,
};
