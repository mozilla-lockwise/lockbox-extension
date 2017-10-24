/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized, withLocalization } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { cancelEditing } from "../../actions";
import DialogBox from "../../../widgets/dialog-box";

function CancelEditingModal({onConfirm, onClose, getString}) {
  return (
    <Localized id="modal-cancel-editing">
      <DialogBox buttonLabels={[getString("modal-cancel-editing-confirm"),
                                getString("modal-cancel-editing-cancel")]}
                 onClick={(i) => { if (i === 0) { onConfirm(); } }}
                 onClose={onClose}>
        cANCEl eDITINg?
      </DialogBox>
    </Localized>
  );
}

CancelEditingModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  getString: PropTypes.func.isRequired,
};

export default connect(
  undefined,
  (dispatch) => ({
    onConfirm: () => { dispatch(cancelEditing()); },
  })
)(withLocalization(CancelEditingModal));
