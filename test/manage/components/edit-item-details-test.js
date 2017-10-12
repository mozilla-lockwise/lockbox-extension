/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiEnzyme);
chai.use(sinonChai);

import { simulateTyping } from "test/common";
import mountWithL10n from "test/mock-l10n";
import EditItemDetails from
       "src/webextension/manage/components/edit-item-details";

describe("manage > components > <EditItemDetails/>", () => {
  const blankFields = {
    title: "",
    origin: "",
    username: "",
    password: "",
    notes: "",
  };

  const originalFields = {
    title: "title",
    origin: "origin",
    username: "username",
    password: "password",
    notes: "notes",
  };

  const updatedFields = {
    title: "new title",
    origin: "new origin",
    username: "new username",
    password: "new password",
    notes: "new notes",
  };

  let onSave, onCancel, wrapper;

  beforeEach(() => {
    onSave = sinon.spy();
    onCancel = sinon.spy();
  });

  describe("new item", () => {
    beforeEach(() => {
      wrapper = mountWithL10n(
        <EditItemDetails onSave={onSave} onCancel={onCancel}/>
      );
    });

    it("form fields unfilled", () => {
      for (let i in blankFields) {
        expect(wrapper.find(`[name="${i}"]`).filterWhere((x) => {
          return typeof x.type() !== "string";
        })).to.have.prop("value", blankFields[i]);
      }
    });

    it("onSave called", () => {
      wrapper.findWhere((x) => x.prop("id") === "item-details-save")
             .find("button").simulate("submit");
      expect(onSave).to.have.been.calledWith(blankFields);
    });

    it("onSave called after editing", () => {
      for (let i in updatedFields) {
        simulateTyping(wrapper.find(`[name="${i}"]`).filterWhere((x) => {
          return typeof x.type() === "string";
        }), updatedFields[i]);
      }
      wrapper.findWhere((x) => x.prop("id") === "item-details-save")
             .find("button").simulate("submit");

      expect(onSave).to.have.been.calledWith(updatedFields);
    });

    it("onCancel called", () => {
      wrapper.findWhere((x) => x.prop("id") === "item-details-cancel")
             .find("button").simulate("click");
      expect(onCancel).to.have.been.calledWith();
    });
  });

  describe("existing item", () => {
    beforeEach(() => {
      wrapper = mountWithL10n(
        <EditItemDetails fields={originalFields}
                         onSave={onSave} onCancel={onCancel}/>
      );
    });

    it("form fields filled", () => {
      for (let i in originalFields) {
        expect(wrapper.find(`[name="${i}"]`).filterWhere((x) => {
          return typeof x.type() !== "string";
        })).to.have.prop("value", originalFields[i]);
      }
    });

    it("onSave called", () => {
      wrapper.findWhere((x) => x.prop("id") === "item-details-save")
             .find("button").simulate("submit");
      expect(onSave).to.have.been.calledWith(originalFields);
    });

    it("onSave called after editing", () => {
      for (let i in updatedFields) {
        simulateTyping(wrapper.find(`[name="${i}"]`).filterWhere((x) => {
          return typeof x.type() === "string";
        }), updatedFields[i]);
      }
      wrapper.findWhere((x) => x.prop("id") === "item-details-save")
             .find("button").simulate("submit");

      expect(onSave).to.have.been.calledWith(updatedFields);
    });

    it("onCancel called", () => {
      wrapper.findWhere((x) => x.prop("id") === "item-details-cancel")
             .find("button").simulate("click");
      expect(onCancel).to.have.been.calledWith();
    });
  });
});
