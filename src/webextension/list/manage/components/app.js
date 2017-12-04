/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";
import DocumentTitle from "react-document-title";

import AccountSummary from "../containers/account-summary";
import AddItem from "../containers/add-item";
import AllItems from "../containers/all-items";
import CurrentSelection from "../containers/current-selection";
import GoHome from "../containers/go-home";
import ItemFilter from "../../containers/item-filter";
import ItemCount from "../containers/item-count";
import ModalRoot from "../containers/modals";
import SendFeedback from "../components/send-feedback";
import Toolbar, { ToolbarSpace } from "../../../widgets/toolbar";

import styles from "./app.css";

export default function App() {
  return (
    <Localized id="document">
      <DocumentTitle title="lOCKBOx eNTRIEs">
        <div className={styles.app}>
          <section className={styles.appMain}>
            <Toolbar className={styles.sideToolbar}>
              <ItemCount/>
              <ToolbarSpace/>
              <AddItem/>
            </Toolbar>
            <Toolbar className={styles.mainToolbar}>
              <GoHome />
              <ToolbarSpace/>
              <SendFeedback/>
              <AccountSummary/>
            </Toolbar>
            <aside>
              <ItemFilter/>
              <AllItems/>
            </aside>
            <article>
              <CurrentSelection/>
            </article>
          </section>
          <ModalRoot/>
        </div>
      </DocumentTitle>
    </Localized>
  );
}
