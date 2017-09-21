/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

export default function Button({className, ...props}) {
  let finalClassName = `browser-style ${className || ""}`.trimRight();
  return (
    <button className={finalClassName} {...props}/>
  );
}

Button.propTypes = {
  className: PropTypes.string,
};
