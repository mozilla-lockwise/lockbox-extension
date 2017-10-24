/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized, withLocalization } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { removeItem } from "../../actions";
import DialogBox from "../../../widgets/dialog-box";

function DeleteItemModal({onConfirm, onClose, getString}) {
  return (
    <Localized id="modal-delete">
      <DialogBox buttonLabels={[getString("modal-delete-confirm"),
                                getString("modal-delete-cancel")]}
                 onClick={(i) => { if (i === 0) { onConfirm(); } }}
                 onClose={onClose}>
        dELETe iTEm?
      </DialogBox>
    </Localized>
  );
}

DeleteItemModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  getString: PropTypes.func.isRequired,
};

export default connect(
  (state) => state.modal.props,
  undefined,
  ({id}, {dispatch}, ownProps) => ({
    onConfirm: () => { dispatch(removeItem(id)); },
    ...ownProps,
  })
)(withLocalization(DeleteItemModal));
