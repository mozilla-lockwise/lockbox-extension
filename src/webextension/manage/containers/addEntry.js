/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import React from "react";
import { connect } from "react-redux";

import { addEntry } from "../actions";

function AddEntry({dispatch}) {
  return (
    <Localized id="add-entry">
      <button onClick={() => { dispatch(addEntry()); }}>
        aDd eNTRy
      </button>
    </Localized>
  );
}

AddEntry = connect()(AddEntry);
export default AddEntry;
