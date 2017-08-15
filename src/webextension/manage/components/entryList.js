/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";

import Entry from "./entry";
import styles from "./entryList.css";

export default function EntryList({entries, selected, onEntryClick}) {
  return (
    <ul className={styles.entryList}>
      {entries.map((entry) => (
        <Entry key={entry.id} name={entry.site}
               selected={entry.id === selected}
               onClick={() => onEntryClick(entry.id)}/>
      ))}
    </ul>
  );
}

EntryList.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      site: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onEntryClick: PropTypes.func.isRequired,
};
