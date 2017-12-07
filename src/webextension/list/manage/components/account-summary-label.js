/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

export default function AccountSummaryLabel({email}) {
  if (!email) {
    return null;
  }

  return (
    <span>{email}</span>
  );
}

AccountSummaryLabel.propTypes = {
  email: PropTypes.string,
};
