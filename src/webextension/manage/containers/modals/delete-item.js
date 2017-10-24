/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { removeItem } from "../../actions";
import { ConfirmDialog } from "../../../widgets/dialog-box";

function DeleteItemModal({onConfirm, onClose}) {
  return (
    <Localized id="modal-delete">
      <ConfirmDialog confirmLabel="dELETe" cancelLabel="cANCEl"
                     onConfirm={onConfirm} onClose={onClose}>
        dELETe iTEm?
      </ConfirmDialog>
    </Localized>
  );
}

DeleteItemModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connect(
  (state) => state.modal.props,
  undefined,
  ({id}, {dispatch}, ownProps) => ({
    onConfirm: () => { dispatch(removeItem(id)); },
    ...ownProps,
  })
)(DeleteItemModal);
