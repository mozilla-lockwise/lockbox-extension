/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import React from "react";
import ReactDOM from "react-dom";
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

    it("onSave called", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(onSave).to.have.been.calledWith(fields);
    });

    it("onSave called after editing", () => {
      const fields = wrapper.find("input");
      simulateTyping(fields.at(0), "new title");
      simulateTyping(fields.at(1), "new username");
      simulateTyping(fields.at(2), "new password");
      wrapper.find('button[type="submit"]').simulate("submit");

      const updatedFields = {
        title: "new title",
        username: "new username",
        password: "new password",
      };
      expect(onSave).to.have.been.calledWith(updatedFields);
    });

    it("onDelete called", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(onDelete).to.have.been.calledWith();
    });
  });
});
