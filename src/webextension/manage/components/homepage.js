/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { withLocalization } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import styles from "./homepage.css";
import lockie from "./lockie.txt";

function printableLength(s) {
  return s.replace(/(\u2068|\u2069)/g, "").length;
}

function speechBubble(text) {
  const lines = text.split("\n");
  const innerWidth = Math.max(...lines.map(printableLength), 1);

  const result = [
    " " + "_".repeat(innerWidth + 4),
    "/" + " ".repeat(innerWidth + 4) + "\\",
    ...lines.map((i) => {
      return "|  " + i + " ".repeat(innerWidth - printableLength(i)) + "  |";
    }),
    "\\__   " + "_".repeat(innerWidth - 1) + "/",
    "   \\ /",
    "    v",
  ];
  return result.join("\n");
}

function Homepage({count, getString}) {
  let key;
  if (count === 0) {
    key = "homepage-no-passwords";
  } else if (count < 10) {
    key = "homepage-under-10-passwords";
  } else if (count < 50) {
    key = "homepage-under-50-passwords";
  } else {
    key = "homepage-over-50-passwords";
  }

  return (
    <pre className={styles.homepage}>{
      speechBubble(getString(key, {count})) + "\n" + lockie
    }</pre>
  );
}

Homepage.propTypes = {
  count: PropTypes.number.isRequired,
  getString: PropTypes.func.isRequired,
};

export default withLocalization(Homepage);
