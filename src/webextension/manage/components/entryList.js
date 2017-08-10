/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";

import Entry from "./entry";

export default function EntryList({entries, selected, onEntryClick}) {
  const style = {
    margin: 0,
    padding: 0,
    listStyle: "none",
    borderTop: "1px solid black",
  };

  return (
    <ul style={style}>
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
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onEntryClick: PropTypes.func.isRequired,
};
