/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import ModalRoot from "../../widgets/modal-root";
import { LocalizedConfirmDialog } from "../../widgets/dialog-box";
import { hideModal, cancelEditing, removeItem } from "../actions";

export const CancelEditingModal = connect(
  (state) => ({
    l10nId: "modal-cancel-editing",
  }),
  (dispatch) => ({
    onConfirm: () => { dispatch(cancelEditing()); },
  })
)(LocalizedConfirmDialog);

export const DeleteItemModal = connect(
  (state) => ({
    l10nId: "modal-delete",
  }),
  (dispatch, {itemId}) => ({
    onConfirm: () => { dispatch(removeItem(itemId)); },
  })
)(LocalizedConfirmDialog);

const MODALS = {
  "cancel": CancelEditingModal,
  "delete": DeleteItemModal,
};

export default connect(
  (state) => ({
    modals: MODALS,
    modalId: state.modal.id,
    modalProps: state.modal.props,
  }),
  (dispatch) => ({
    onClose: () => { dispatch(hideModal()); },
  })
)(ModalRoot);
