/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";

import AddEntry from "../containers/addEntry";
import AllEntries from "../containers/allEntries";

export default function App() {
  return (
    <div>
      <AddEntry/>
      <AllEntries/>
    </div>
  );
};
