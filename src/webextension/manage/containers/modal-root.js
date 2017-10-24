/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-modal";
import { connect } from "react-redux";

import { hideModal } from "../actions";
import CancelEditingModal from "./modals/cancel-editing";
import DeleteItemModal from "./modals/delete-item";

import styles from "./modal-root.css";

const MODALS = {
  "cancel": CancelEditingModal,
  "delete": DeleteItemModal,
};

function ModalRoot({modalId, dispatch}) {
  if (!modalId) {
    return null;
  }
  const CurrentModal = MODALS[modalId];

  return (
    <Localized id="modal-root">
      <Modal isOpen={true} className={styles.modal}
             overlayClassName={styles.overlay}>
        <CurrentModal onClose={() => { dispatch(hideModal()); }}/>
      </Modal>
    </Localized>
  );
}

ModalRoot.propTypes = {
  modalId: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    modalId: state.modal.id,
  })
)(ModalRoot);
