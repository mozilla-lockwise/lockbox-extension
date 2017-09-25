/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { filterItems } from "../actions";
import { parseFilterString } from "../filter";
import FilterInput from "../../widgets/filter-input";

function ItemFilter({dispatch}) {
  return (
    <Localized id="item-filter">
      <FilterInput placeholder="fILTEr…" onChange={(value) => {
        dispatch(filterItems(parseFilterString(value)));
      }}/>
    </Localized>
  );
}

ItemFilter.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(ItemFilter);
