/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";

import AddEntry from "../containers/addEntry";
import AllEntries from "../containers/allEntries";
import CurrentEntry from "../containers/currentEntry";

import styles from "./app.css";

export default function App() {
  return (
    <section className={styles.app}>
      <aside>
        <AddEntry/>
        <AllEntries/>
      </aside>
      <article>
        <CurrentEntry/>
      </article>
    </section>
  );
}
