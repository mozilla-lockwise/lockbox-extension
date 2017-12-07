/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as telemetry from "../../../telemetry";
import LinkAccount from "../components/link-account";
import AccountLinked from "../components/account-linked";

function linkAction(action) {
  const obj = (action === "signup") ?
              "manageAcctCreate" :
              "manageAcctSignin";
  return async () => {
    telemetry.recordEvent("click", obj);
    browser.runtime.sendMessage({
      type: "upgrade_account",
      action,
    });
  };
}

const ConnectedLinkAccount = connect(
  (state) => ({
    ...state,
    onCreate: linkAction("signup"),
    onSignin: linkAction("signin"),
  })
)(LinkAccount);

function AccountDetails({mode}) {
  let inner = null;

  if (mode === "guest") {
    inner = <ConnectedLinkAccount />;
  } else if (mode === "authenticated") {
    inner = <AccountLinked />;
  }

  return <div>{inner}</div>;
}
AccountDetails.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default connect(
  (state) => ({
    mode: state.account.mode,
  })
)(AccountDetails);
