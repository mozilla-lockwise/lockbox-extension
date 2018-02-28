/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";
import DocumentTitle from "react-document-title";

import AddItem from "../containers/add-item";
import AllItems from "../containers/all-items";
import CurrentAccountSummary from "../containers/current-account-summary";
import CurrentSelection from "../containers/current-selection";
import GoHome from "../containers/go-home";
import ItemFilter from "../../containers/item-filter";
import ModalRoot from "../containers/modals";
import SendFeedback from "../containers/send-feedback";
import OpenFAQ from "../containers/open-faq";
import Toolbar, { ToolbarSpace } from "../../../widgets/toolbar";

import styles from "./app.css";

export default class App extends React.Component {
  componentDidMount() {
    this._filterField.focus();
  }

  render() {
    return (
      <Localized id="document">
        <DocumentTitle title="lOCKBOx eNTRIEs">
          <div className={styles.app}>
            <section className={styles.appMain}>
              <Toolbar className={styles.navigation}>
                <AddItem/>
                <GoHome/>
                <ToolbarSpace/>
                <OpenFAQ/>
                <SendFeedback/>
                <CurrentAccountSummary/>
              </Toolbar>
              <aside>
                <ItemFilter className={styles.filter}
                            inputRef={(element) => {
                              this._filterField = element;
                            }}/>
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
}
