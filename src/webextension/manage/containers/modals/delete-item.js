/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { removeItem, hideModal } from "../../actions";
import DialogBox from "../../../widgets/dialog-box";

function DeleteItemModal({id, dispatch}) {
  return (
    <Localized id="modal-delete">
      <DialogBox text="dELETe iTEm?"
                 primaryButtonLabel="dELETe"
                 secondaryButtonLabel="cANCEl"
                 onClickPrimary={() => {
                   dispatch(removeItem(id));
                   dispatch(hideModal());
                 }}
                 onClickSecondary={() => {
                   dispatch(hideModal());
                 }}/>
    </Localized>
  );
}

DeleteItemModal.propTypes = {
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(
  (state) => state.modal.props
)(DeleteItemModal);
