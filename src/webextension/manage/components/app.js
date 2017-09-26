/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";

import AddItem from "../containers/add-item";
import AllItems from "../containers/all-items";
import CurrentSelection from "../containers/current-selection";
import ItemFilter from "../containers/item-filter";

import styles from "./app.css";

export default function App() {
  return (
    <section className={styles.app}>
      <aside>
        <ItemFilter/>
        <AllItems/>
        <div>
          <AddItem/>
        </div>
      </aside>
      <article>
        <CurrentSelection/>
      </article>
    </section>
  );
}
