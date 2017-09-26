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

describe("<ItemDetails/>", () => {
  const fields = {
    title: "title",
    origin: "origin",
    username: "username",
    password: "password",
    notes: "notes",
  };

  let onEdit, onDelete, wrapper;

  beforeEach(() => {
    onEdit = sinon.spy();
    onDelete = sinon.spy();
    wrapper = mountWithL10n(
      <ItemDetails fields={fields} onEdit={onEdit} onDelete={onDelete}/>
    );
  });

  it("render fields", () => {
    for (let i in fields) {
      if (i !== "password") {
        expect(wrapper.find(`[data-name="${i}"]`).text())
              .to.equal(fields[i]);
      }
    }
  });

  it("onEdit called", () => {
    wrapper.findWhere((x) => x.prop("id") === "item-details-edit")
           .find("button").simulate("click");
    expect(onEdit).to.have.been.calledWith();
  });

   it("onDelete called", () => {
    wrapper.findWhere((x) => x.prop("id") === "item-details-delete")
           .find("button").simulate("click");
    expect(onDelete).to.have.been.calledWith();
  });
});
