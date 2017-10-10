/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../widgets/button";

export default function FactoryReset() {
  const onReset = async() => {
    await browser.runtime.sendMessage({
      type: "reset",
    });
  };

  return (
    <section>
      <Localized id="settings-factoryreset-title">
        <h3>rESEt lOCKBOx</h3>
      </Localized>
      <Localized id="settings-factoryreset-description">
        <p>dO tHe fACTORy rESEt</p>
      </Localized>
      <Localized id="settings-factoryreset-button">
        <Button onClick={onReset}>💣💣💣 rESEt aLL! 💣💣💣</Button>
      </Localized>
    </section>
  );
}

FactoryReset.propTypes = {};
