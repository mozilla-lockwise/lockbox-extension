/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";
import { connect } from "react-redux";

import { filterItems } from "../actions";
import FilterInput from "../../widgets/filter-input";
import styles from "./item-filter.css";

function ItemFilter(props) {
  return (
    <Localized id="item-filter">
      <FilterInput placeholder="fILTEr…" className={styles.filter} {...props}/>
    </Localized>
  );
}

export default connect(
  (state) => ({
    value: state.filter,
    disabled: state.cache.items.length === 0,
  }),
  (dispatch) => ({
    onChange: (value) => { dispatch(filterItems(value)); },
  })
)(ItemFilter);
