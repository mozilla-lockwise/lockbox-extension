/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Button from "../../widgets/button";
import { startNewItem } from "../actions";
import * as telemetry from "../../telemetry";

import styles from "./homepage.css";

function Homepage({count, dispatch}) {
  const doAddItem = () => {
    telemetry.recordEvent("addClick", "addButton", "homescreenAddButton");
    dispatch(startNewItem());
  };

  const imgSrc = browser.extension.getURL("/images/lockie_v2.svg");

  let title;
  if (count === 0) {
    title = "welcOMe to lOcKboX";
  } else {
    title = "YoU have X enTrieS in YoUr lOcKboX";
  }

  return (
    <article className={styles.homepage}>
      <img src={imgSrc} alt=""/>
      <Localized id="homepage-title" $count={count}>
        <h1>{title}</h1>
      </Localized>
      <Localized id="homepage-greeting">
        <p>{"yOu'Ve suCCessfuLLY iNSTalled..."}</p>
      </Localized>
      <Localized id="homepage-add-entry">
        <Button theme="primary" onClick={doAddItem}>
          aDd enTry
        </Button>
      </Localized>
    </article>
  );
}

Homepage.propTypes = {
  count: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Homepage);
