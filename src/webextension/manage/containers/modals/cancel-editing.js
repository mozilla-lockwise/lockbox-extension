/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { cancelEditing, hideModal } from "../../actions";
import DialogBox from "../../../widgets/dialog-box";

function CancelEditingModal({dispatch}) {
  return (
    <Localized id="modal-cancel">
      <DialogBox text="cANCEl eDITINg?"
                 primaryButtonLabel="dISCARd"
                 secondaryButtonLabel="go bACk"
                 onClickPrimary={() => {
                   dispatch(cancelEditing());
                   dispatch(hideModal());
                 }}
                 onClickSecondary={() => {
                   dispatch(hideModal());
                 }}/>
    </Localized>
  );
}

CancelEditingModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CancelEditingModal);
