/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react/compat";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";

import { AppLocalizationProvider } from "./l10n";
import { store, minusOne, plusOne } from "./redux";

// Components

const Score = ({value, onMinusOne, onPlusOne}) => {
    return (
      <div>
        <Localized id="hello">
          <h1 id="title">hELLo, wORLd!</h1>
        </Localized>
        <button onClick={() => onMinusOne()}>-1</button>
        <span>{value}</span>
        <button onClick={() => onPlusOne()}>+1</button>
      </div>
    );
};

Score.propTypes = {
  value: PropTypes.number.isRequired,
  onMinusOne: PropTypes.func.isRequired,
  onPlusOne: PropTypes.func.isRequired,
};

// Containers

const ScoreContainer = connect(
  (state) => ({
    value: state.value
  }),
  (dispatch) => ({
    onMinusOne: () => dispatch(minusOne()),
    onPlusOne: () => dispatch(plusOne()),
  })
)(Score);

ReactDOM.render(
  <Provider store={store}>
    <AppLocalizationProvider userLocales={navigator.languages}>
      <ScoreContainer/>
    </AppLocalizationProvider>
  </Provider>,
  document.getElementById("content")
);
