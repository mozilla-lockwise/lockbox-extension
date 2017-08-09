/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";

export default function EntryDetails({name, id, onDelete}) {
  if (id === null) {
    return (
      <Localized id="no-entry">
        <div style={{margin: "1em"}}>no eNTRy sELECTEd</div>
      </Localized>
    );
  }

  return (
    <div style={{margin: "1em"}}>
      <Localized id="entry-title" $name={name}>
        <div>eNTRy</div>
      </Localized>
      <Localized id="delete-entry">
        <button onClick={() => onDelete(id)}>dELETe</button>
      </Localized>
    </div>
  );
}

EntryDetails.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
};
