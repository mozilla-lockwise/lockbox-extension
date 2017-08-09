/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";

import AddEntry from "../containers/addEntry";
import AllEntries from "../containers/allEntries";
import CurrentEntry from "../containers/currentEntry";

export default function App() {
  return (
    <section style={{display: "flex", width: "100vw", height: "100vh"}}>
      <aside style={{borderRight: "1px solid black"}}>
        <AddEntry/>
        <AllEntries/>
      </aside>
      <article>
        <CurrentEntry/>
      </article>
    </section>
  );
};
