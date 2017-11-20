/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";

import Button from "../../../widgets/button";
import * as telemetry from "../../../telemetry";

const FEEDBACK_URL = "https://qsurvey.mozilla.com/s3/Lockbox-Input";

export default function SendFeedback() {
  const doClick = () => {
    telemetry.recordEvent("feedbackClick", "manage");
    window.open(FEEDBACK_URL, "_blank");
  };

  return (
    <Localized id="toolbar-send-feedback">
      <Button theme="ghost" onClick={doClick}>
        fEEDBACk
      </Button>
    </Localized>
  );
}

SendFeedback.propTypes = {};
