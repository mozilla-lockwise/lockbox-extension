/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../../widgets/button";
import Panel, { PanelHeader, PanelBody, PanelFooter } from
       "../../../widgets/panel";
import ItemFilter from "../../../manage/containers/item-filter";
import AllItems from "../containers/all-items";

export default function ItemListPanel() {
  const openManager = () => {
    browser.runtime.sendMessage({
      type: "open_view",
      name: "manage",
    });
    window.close();
  };

  return (
    <Panel>
      <PanelHeader>
        <ItemFilter/>
      </PanelHeader>

      <PanelBody>
        <AllItems/>
      </PanelBody>

      <PanelFooter>
        <Localized id="manage-lockbox">
          <Button theme="ghost" onClick={openManager}>
            mANAGe lOCKBox
          </Button>
        </Localized>
      </PanelFooter>
    </Panel>
  );
}
