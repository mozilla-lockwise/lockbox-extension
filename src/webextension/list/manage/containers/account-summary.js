/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import AccountSummaryLabel from "../components/account-summary-label";

export default connect(
  (state) => {
    if (state.account.mode === "authenticated") {
      return {
        email: state.account.email,
      };
    }
    return {};
  }
)(AccountSummaryLabel);
