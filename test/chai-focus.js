/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ReactWrapper } from "enzyme";

export default function chaiFocus(chai, utils) {
  chai.Assertion.addMethod("focused", function(doc = window.document) {
    const obj = this._obj instanceof ReactWrapper ? this._obj.instance() :
                this._obj;

    this.assert(
      obj === doc.activeElement,
      "expected #{exp} to be focused but got #{act}",
      "expected #{exp} not to be focused",
      obj.tagName,
      doc.activeElement.tagName
    );
  });
}
