/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Button from "../../widgets/button";
import { selectItem } from "../actions";

function GoHome({dispatch}) {
  return (
    <Localized id="go-home">
      <Button onClick={() => { dispatch(selectItem(null)); }}>
        hOMe
      </Button>
    </Localized>
  );
}

GoHome.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(GoHome);
