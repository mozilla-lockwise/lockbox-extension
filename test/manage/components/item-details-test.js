/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import React from "react";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import mountWithL10n from "../../mock-l10n";
import ItemDetails from
       "../../../src/webextension/manage/components/item-details";

function simulateTyping(wrapper, value) {
  wrapper.get(0).value = value;
  wrapper.at(0).simulate("change");
}

describe("<ItemDetails/>", () => {
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

  let onSave, onDelete, wrapper;

  describe("new item", () => {
    beforeEach(() => {
      onSave = sinon.spy();
      onDelete = sinon.spy();
      wrapper = mountWithL10n(
        <ItemDetails saveLabel="save-item" deleteLabel="delete-item"
                     onSave={onSave} onDelete={onDelete}/>
      );
    });

    it("form fields unfilled", () => {
      for (let i in blankFields) {
        expect(wrapper.find(`[name="${i}"]`).prop("value"))
              .to.equal(blankFields[i]);
      }
    });

    it("onSave called", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(onSave).to.have.been.calledWith(blankFields);
    });

    it("onSave called after editing", () => {
      for (let i in updatedFields) {
        simulateTyping(wrapper.find(`[name="${i}"]`), updatedFields[i]);
      }
      wrapper.find('button[type="submit"]').simulate("submit");

      expect(onSave).to.have.been.calledWith(updatedFields);
    });

    it("onDelete called", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(onDelete).to.have.been.calledWith();
    });
  });

  describe("existing item", () => {
    beforeEach(() => {
      onSave = sinon.spy();
      onDelete = sinon.spy();
      wrapper = mountWithL10n(
        <ItemDetails fields={originalFields}
                     saveLabel="save-item" deleteLabel="delete-item"
                     onSave={onSave} onDelete={onDelete}/>
      );
    });

    it("form fields filled", () => {
      for (let i in originalFields) {
        expect(wrapper.find(`[name="${i}"]`).prop("value"))
              .to.equal(originalFields[i]);
      }
    });

    it("onSave called", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(onSave).to.have.been.calledWith(originalFields);
    });

    it("onSave called after editing", () => {
      for (let i in updatedFields) {
        simulateTyping(wrapper.find(`[name="${i}"]`), updatedFields[i]);
      }
      wrapper.find('button[type="submit"]').simulate("submit");

      expect(onSave).to.have.been.calledWith(updatedFields);
    });

    it("onDelete called", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(onDelete).to.have.been.calledWith();
    });
  });

  describe("change selected item", () => {
    beforeEach(() => {
      onSave = sinon.spy();
      onDelete = sinon.spy();
      wrapper = mountWithL10n(
        <ItemDetails fields={originalFields}
                     saveLabel="save-item" deleteLabel="delete-item"
                     onSave={onSave} onDelete={onDelete}/>
      );
    });

    it("form fields updated", () => {
      for (let i in originalFields) {
        expect(wrapper.find(`[name="${i}"]`).prop("value"))
              .to.equal(originalFields[i]);
      }

      wrapper.setProps({fields: updatedFields});

      for (let i in updatedFields) {
        expect(wrapper.find(`[name="${i}"]`).prop("value"))
              .to.equal(updatedFields[i]);
      }
    });
  });
});
