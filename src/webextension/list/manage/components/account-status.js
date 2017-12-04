/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Button from "../../../widgets/button";

export function AccountStatus({email, onClick, ...props}) {
  if (!email) {
    return null;
  }

  return (
    <Button theme="ghost">{email} ☰</Button>
  );
}
AccountStatus.propTypes = {
  email: PropTypes.string,
  onClick: PropTypes.func,
};

export default connect(
  (state) => {
    if (state.account.mode === "authenticated") {
      return {
        email: state.account.email,
      };
    }
    return {};
  }
)(AccountStatus);
