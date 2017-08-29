/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { startNewItem } from "../actions";

function AddItem({dispatch}) {
  return (
    <Localized id="add-item">
      <button onClick={() => { dispatch(startNewItem()); }}>
        aDd iTEm
      </button>
    </Localized>
  );
}

AddItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

AddItem = connect()(AddItem);
export default AddItem;
