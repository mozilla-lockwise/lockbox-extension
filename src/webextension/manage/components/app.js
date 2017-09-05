/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";

import AddItem from "../containers/addItem";
import AllItems from "../containers/allItems";
import CurrentItem from "../containers/currentItem";

import styles from "./app.css";

export default function App() {
  return (
    <section className={styles.app}>
      <aside>
        <AllItems/>
        <AddItem/>
      </aside>
      <article>
        <CurrentItem/>
      </article>
    </section>
  );
}
