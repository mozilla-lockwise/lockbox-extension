/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect } from "chai";

import reducer, {
 modalReducer,
} from "src/webextension/settings/reducers";

describe("settings > reducers", () => {
  describe("modal reducer", () => {
    it("initial state", () => {
      expect(modalReducer(undefined, {})).to.deep.equal({
        id: null,
        props: null,
      });
    });
  });

  describe("<<default>> reducer", () => {
    it("initial state", () => {
      expect(reducer(undefined, {})).to.deep.equal({
        modal: {
          id: null,
          props: null,
        },
      });
    });
  });
});
