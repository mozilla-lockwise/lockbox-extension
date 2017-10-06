/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../widgets/button";

export default function ResetDataStore() {
  const onReset = async() => {
    await browser.runtime.sendMessage({
      type: "reset",
    });
  };

  return (
    <section>
      <Localized id="settings-reset-title">
        <h3>Reset Lockbox</h3>
      </Localized>
      <Localized id="settings-reset-description">
        <p>Reset the local database, deleting all of your existing entries.  <strong>THIS CANNOT BE UNDONE</strong></p>
      </Localized>
      <Localized id="settings-reset-button">
        <Button onClick={onReset}>💣💣💣 rESEt aLL! 💣💣💣</Button>
      </Localized>
    </section>
  );
}

ResetDataStore.propTypes = {};
