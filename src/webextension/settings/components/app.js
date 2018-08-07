/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import LocalReset from "./local-reset";
import ModalRoot from "../containers/modals";

import "./app.css";

export default function App() {
  return (
    <article>
      <Localized id="settings-disclaimer">
        <h1>nOTe: tHIs eXTENSION Is nOt mAINTAINEd</h1>
      </Localized>
      <LocalReset/>
      <ModalRoot/>
    </article>
  );
}
