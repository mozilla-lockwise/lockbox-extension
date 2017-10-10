 /* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

function ItemCount({count}) {
  return (
    <Localized id="toolbar-item-count" $count={count}>
      <span>## iTEMs</span>
    </Localized>
  );
}

ItemCount.propTypes = {
  count: PropTypes.number.isRequired,
};

export default connect(
  (state) => ({
    count: state.cache.items.length,
  })
)(ItemCount);
