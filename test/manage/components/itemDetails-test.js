/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import { mount } from "enzyme";
import React from "react";
import ReactDOM from "react-dom";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import MockLocalizationProvider from "../../mock-l10n";
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
      wrapper = mount(
        <MockLocalizationProvider>
          <ItemDetails onSave={onSave} onDelete={onDelete}/>
        </MockLocalizationProvider>
      );
    });

    it("onSave called", () => {
      wrapper.find('button[type="submit"]').simulate("submit");

      const item = {
        id: undefined,
        title: "",
        username: "",
        password: "",
      };
      expect(onSave).to.have.been.calledWith(item);
    });

    it("onSave called after editing", () => {
      const fields = wrapper.find("input");
      simulateTyping(fields.at(0), "new title");
      simulateTyping(fields.at(1), "new username");
      simulateTyping(fields.at(2), "new password");
      wrapper.find('button[type="submit"]').simulate("submit");

      const item = {
        id: undefined,
        title: "new title",
        username: "new username",
        password: "new password",
      };
      expect(onSave).to.have.been.calledWith(item);
    });

    it("onDelete called", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(onDelete).to.have.been.calledWith();
    });
  });

  describe("existing item", () => {
    const item = {
      id: "0",
      title: "title",
      username: "username",
      password: "password",
    };

    beforeEach(() => {
      onSave = sinon.spy();
      onDelete = sinon.spy();
      wrapper = mount(
        <MockLocalizationProvider>
          <ItemDetails item={item} onSave={onSave} onDelete={onDelete}/>
        </MockLocalizationProvider>
      );
    });

    it("onSave called", () => {
      wrapper.find('button[type="submit"]').simulate("submit");
      expect(onSave).to.have.been.calledWith(item);
    });

    it("onSave called after editing", () => {
      const fields = wrapper.find("input");
      simulateTyping(fields.at(0), "new title");
      simulateTyping(fields.at(1), "new username");
      simulateTyping(fields.at(2), "new password");
      wrapper.find('button[type="submit"]').simulate("submit");

      const updatedItem = {
        id: item.id,
        title: "new title",
        username: "new username",
        password: "new password",
      };
      expect(onSave).to.have.been.calledWith(updatedItem);
    });

    it("onDelete called", () => {
      wrapper.find("button").not('[type="submit"]').simulate("click");
      expect(onDelete).to.have.been.calledWith(item.id);
    });
  });
});
