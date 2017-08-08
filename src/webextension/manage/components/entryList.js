/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";

import Entry from "./entry";

export default function EntryList({entries}) {
  return (
    <ul>
      {entries.map((entry) => (
        <Entry key={entry.id} name={entry.name}/>
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
};
