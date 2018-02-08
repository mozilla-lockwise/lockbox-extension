/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from "react-redux";

import AccountSummary from "../components/account-summary";
import { openAccountPage, openOptions, signout } from "../../actions";

export default connect(
  (state) => {
    if (state.account.mode === "authenticated") {
      return {
        displayName: state.account.displayName,
        avatar: state.account.avatar,
      };
    }
    return {};
  },
  (dispatch) => ({
    onClickAccount: () => { dispatch(openAccountPage()); },
    onClickOptions: () => { dispatch(openOptions()); },
    onClickSignout: () => { dispatch(signout()); },
  }),
)(AccountSummary);
