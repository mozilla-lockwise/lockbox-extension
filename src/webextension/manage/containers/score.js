/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import Score from "../components/score";
import { minusOne, plusOne } from "../actions";

const ScoreContainer = connect(
  (state) => ({
    value: state.value
  }),
  (dispatch) => ({
    onMinusOne: () => dispatch(minusOne()),
    onPlusOne: () => dispatch(plusOne()),
  })
)(Score);

export default ScoreContainer;
