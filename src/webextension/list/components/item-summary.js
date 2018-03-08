/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import { NEW_ITEM_ID } from "../common";
import CopyToClipboardButton from "../../widgets/copy-to-clipboard-button";

import styles from "./item-summary.css";

function ItemSummaryCopyButtons({id, username, onCopy}) {
  async function getPassword() {
    const response = await browser.runtime.sendMessage({
      type: "get_item",
      id,
    });
    return response.item.entry.password;
  }

  return (
    <div className={styles.verbose}
         onMouseDown={(e) => e.stopPropagation()}>
      <Localized id="item-summary-copy-username">
        <CopyToClipboardButton className={styles.copyButton}
                               buttonClassName={styles.copyButtonInner}
                               value={username}
                               onCopy={() => onCopy("username")}>
          cOPy uSERNAMe
        </CopyToClipboardButton>
      </Localized>
      <Localized id="item-summary-copy-password">
        <CopyToClipboardButton className={styles.copyButton}
                               buttonClassName={styles.copyButtonInner}
                               value={getPassword}
                               onCopy={() => onCopy("password")}>
          cOPy pASSWORd
        </CopyToClipboardButton>
      </Localized>
    </div>
  );
}

ItemSummaryCopyButtons.propTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default function ItemSummary({id, title, username, verbose, onCopy}) {
  if (id === NEW_ITEM_ID && verbose) {
    throw new Error("verbose <ItemSummary/> cannot be used with new items");
  }

  const trimmedTitle = title.trim();
  const trimmedUsername = username.trim();

  const idModifier = id === NEW_ITEM_ID ? "new-" : "";
  const titleId = `item-summary-${idModifier}title`;
  const usernameId = `item-summary-${idModifier}username`;
  return (
    <div>
      <div className={styles.itemSummary}>
        <Localized id={titleId} $title={trimmedTitle}
                   $length={trimmedTitle.length}>
          <div className={styles.title}>no tITLe</div>
        </Localized>
        <Localized id={usernameId} $username={trimmedUsername}
                   $length={trimmedUsername.length}>
          <div className={styles.subtitle}>no uSERNAMe</div>
        </Localized>
      </div>
      {verbose && <ItemSummaryCopyButtons id={id} username={username}
                                          onCopy={onCopy}/>}
    </div>
  );
}

ItemSummary.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  username: PropTypes.string,
  verbose: PropTypes.bool,
  onCopy: PropTypes.func,
};

ItemSummary.defaultProps = {
  id: null,
  title: "",
  username: "",
  verbose: false,
};
