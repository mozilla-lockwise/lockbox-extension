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
       "../../../src/webextension/manage/components/itemDetails";

function simulateTyping(wrapper, value) {
  wrapper.get(0).value = value;
  wrapper.at(0).simulate("change");
}

describe("<ItemDetails/>", () => {
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
      const formFields = wrapper.find("input");
      expect(formFields.get(0).value).to.equal("");
      expect(formFields.get(1).value).to.equal("");
      expect(formFields.get(2).value).to.equal("");
    });

    it("onSave called", () => {
      wrapper.find('button[type="submit"]').simulate("submit");

      const fields = {
        title: "",
        username: "",
        password: "",
      };
      expect(onSave).to.have.been.calledWith(fields);
    });

    it("onSave called after editing", () => {
      const formFields = wrapper.find("input");
      simulateTyping(formFields.at(0), "new title");
      simulateTyping(formFields.at(1), "new username");
      simulateTyping(formFields.at(2), "new password");
      wrapper.find('button[type="submit"]').simulate("submit");

      const fields = {
        title: "new title",
        username: "new username",
        password: "new password",
      };
      expect(onSave).to.have.been.calledWith(fields);
    });

    it("onDelete called", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(onDelete).to.have.been.calledWith();
    });
  });

  describe("existing item", () => {
    const fields = {
      title: "title",
      username: "username",
      password: "password",
    };

    beforeEach(() => {
      onSave = sinon.spy();
      onDelete = sinon.spy();
      wrapper = mountWithL10n(
        <ItemDetails fields={fields}
                     saveLabel="save-item" deleteLabel="delete-item"
                     onSave={onSave} onDelete={onDelete}/>
      );
    });

    it("form fields filled", () => {
      const formFields = wrapper.find("input");
      expect(formFields.get(0).value).to.equal(fields.title);
      expect(formFields.get(1).value).to.equal(fields.username);
      expect(formFields.get(2).value).to.equal(fields.password);
    });

    it("onSave called", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(onSave).to.have.been.calledWith(fields);
    });

    it("onSave called after editing", () => {
      const updatedFields = {
        title: "new title",
        username: "new username",
        password: "new password",
      };

      const formFields = wrapper.find("input");
      simulateTyping(formFields.at(0), updatedFields.title);
      simulateTyping(formFields.at(1), updatedFields.username);
      simulateTyping(formFields.at(2), updatedFields.password);
      wrapper.find('button[type="submit"]').simulate("submit");

      expect(onSave).to.have.been.calledWith(updatedFields);
    });

    it("onDelete called", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(onDelete).to.have.been.calledWith();
    });
  });

  describe("change selected item", () => {
    const fields = {
      title: "title",
      username: "username",
      password: "password",
    };

    beforeEach(() => {
      onSave = sinon.spy();
      onDelete = sinon.spy();
      wrapper = mountWithL10n(
        <ItemDetails fields={fields}
                     saveLabel="save-item" deleteLabel="delete-item"
                     onSave={onSave} onDelete={onDelete}/>
      );
    });

    it("form fields updated", () => {
      const formFields = wrapper.find("input");
      expect(formFields.get(0).value).to.equal(fields.title);
      expect(formFields.get(1).value).to.equal(fields.username);
      expect(formFields.get(2).value).to.equal(fields.password);

      const updatedFields = {
        title: "new title",
        username: "new username",
        password: "new password",
      };

      wrapper.setProps({fields: updatedFields});
      expect(formFields.get(0).value).to.equal(updatedFields.title);
      expect(formFields.get(1).value).to.equal(updatedFields.username);
      expect(formFields.get(2).value).to.equal(updatedFields.password);
    });
  });
});
