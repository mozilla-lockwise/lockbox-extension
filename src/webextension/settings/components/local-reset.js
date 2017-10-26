/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import {
  requestLocalReset,
} from "../actions";
import Button from "../../widgets/button";

export function LocalReset({onReset}) {
  return (
    <section>
      <Localized id="settings-local-reset-title">
        <h3>rESEt lOCKBOx</h3>
      </Localized>
      <Localized id="settings-local-reset-description">
        <p>dO tHe fACTORy rESEt</p>
      </Localized>
      <Localized id="settings-local-reset-button">
        <Button onClick={onReset}>💣💣💣 rESEt aLL! 💣💣💣</Button>
      </Localized>
    </section>
  );
}
LocalReset.propTypes = {
  onReset: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
  }),
  (dispatch) => ({
      onReset: () => { dispatch(requestLocalReset()); },
  })
)(LocalReset);
