/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Button from "../../../widgets/button";
import { sendFeedback } from "../../actions";

function SendFeedback({onSendFeedback}) {
  return (
    <Localized id="toolbar-send-feedback">
      <Button theme="ghost" onClick={onSendFeedback}>
        fEEDBACk
      </Button>
    </Localized>
  );
}

SendFeedback.propTypes = {
  onSendFeedback: PropTypes.func.isRequired,
};

export default connect(
  undefined,
  (dispatch) => ({
    onSendFeedback: () => { dispatch(sendFeedback()); },
  })
)(SendFeedback);
