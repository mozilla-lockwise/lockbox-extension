/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { simulateTyping } from "test/common";
import mountWithL10n from "test/mocks/l10n";
import EditItemDetails from
       "src/webextension/list/manage/components/edit-item-details";

chai.use(chaiEnzyme());
chai.use(sinonChai);

describe("list > manage > components > <EditItemDetails/>", () => {
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

  let onChange, onSave, onCancel, wrapper;

  beforeEach(() => {
    onChange = sinon.spy();
    onSave = sinon.spy();
    onCancel = sinon.spy();
  });

  describe("new item", () => {
    beforeEach(() => {
      wrapper = mountWithL10n(
        <EditItemDetails {...{onChange, onSave, onCancel}}/>
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
      wrapper.findWhere((x) => x.prop("id") === "item-details-save-new")
             .find("button").simulate("submit");
      expect(onSave).to.have.been.calledWith(blankFields);
    });

    it("onSave called after editing", () => {
      for (let i in updatedFields) {
        simulateTyping(wrapper.find(`[name="${i}"]`).filterWhere((x) => {
          return typeof x.type() === "string";
        }), updatedFields[i]);
      }
      wrapper.findWhere((x) => x.prop("id") === "item-details-save-new")
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
        <EditItemDetails itemId="1" fields={originalFields}
                         {...{onChange, onSave, onCancel}}/>
      );
    });

    it("form fields filled", () => {
      for (let i in originalFields) {
        expect(wrapper.find(`[name="${i}"]`).filterWhere((x) => {
          return typeof x.type() !== "string";
        })).to.have.prop("value", originalFields[i]);
      }
    });

    it("form fields updated", () => {
      wrapper.setProps({itemId: "2", fields: updatedFields});
      for (let i in updatedFields) {
        expect(wrapper.find(`[name="${i}"]`).filterWhere((x) => {
          return typeof x.type() !== "string";
        })).to.have.prop("value", updatedFields[i]);
      }
    });

    it("onSave called", () => {
      wrapper.findWhere((x) => x.prop("id") === "item-details-save-existing")
             .find("button").simulate("submit");
      expect(onSave).to.have.been.calledWith(originalFields);
    });

    it("onSave called after editing", () => {
      for (let i in updatedFields) {
        simulateTyping(wrapper.find(`[name="${i}"]`).filterWhere((x) => {
          return typeof x.type() === "string";
        }), updatedFields[i]);
      }
      wrapper.findWhere((x) => x.prop("id") === "item-details-save-existing")
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
