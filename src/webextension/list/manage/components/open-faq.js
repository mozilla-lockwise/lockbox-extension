/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../../widgets/button";
import * as telemetry from "../../../telemetry";

const FAQ_URL = "https://mozilla-lockbox.github.io/lockbox-extension/faqs/";

export default function OpenFAQ() {
  const doClick = () => {
    telemetry.recordEvent("faqsClick", "manage");
    window.open(FAQ_URL, "_blank");
  };

  return (
    <Localized id="toolbar-open-faq">
      <Button theme="ghost" onClick={doClick}>
        fAQs
      </Button>
    </Localized>
  );
}

OpenFAQ.propTypes = {};
