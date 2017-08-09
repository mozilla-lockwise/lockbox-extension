/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

export default function Entry({name, selected, onClick}) {
  let style = {
    borderBottom: "1px solid black",
  };
  if (selected) {
    Object.assign(style, {
      color: "HighlightText",
      backgroundColor: "Highlight",
    });
  }

  return (
    <li style={style} onClick={onClick}>{name}</li>
  );
}

Entry.propTypes = {
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
