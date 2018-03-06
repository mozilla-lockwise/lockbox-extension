/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import ModalRoot from "../../widgets/modal-root";
import { LocalizedConfirmDialog } from "../../widgets/dialog-box";
import { hideModal, localReset } from "../actions";

export const LocalResetModal = connect(
  (state) => ({
    l10nId: "modal-local-reset",
    theme: "danger",
  }),
  (dispatch) => ({
    onConfirm: () => { dispatch(localReset()); },
  })
)(LocalizedConfirmDialog);

const MODALS = {
  "local-reset": LocalResetModal,
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
