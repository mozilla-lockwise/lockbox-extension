/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import UpgradeAccountPanel from "../components/upgrade-account-panel";

function upgradeAction(action) {
  return async () => {
    browser.runtime.sendMessage({
      type: "upgrade",
      action,
    });
  };
}

export default connect(
  (state) => {
    return {
      ...state.account,
      doCreateAccount: upgradeAction("signup"),
      doSignIn: upgradeAction("signin"),
    };
  }
)(UpgradeAccountPanel);
