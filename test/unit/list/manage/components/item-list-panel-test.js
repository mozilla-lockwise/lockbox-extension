/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import { initialState, filledState } from "../mock-redux-state";
import mountWithL10n from "test/mocks/l10n";
import ItemSummary from "src/webextension/list/components/item-summary";
import ItemFilter from "src/webextension/list/containers/item-filter";
import ItemListPanel from
       "src/webextension/list/manage/components/item-list-panel";

chai.use(chaiEnzyme());

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("list > manage > components > <ItemListPanel/>", () => {
  describe("empty state", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore(initialState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <ItemListPanel items={[]} totalItemCount={0} onChange={() => {}}/>
        </Provider>
      );
    });

    it("render panel", () => {
      expect(wrapper).to.have.descendants(ItemFilter);
      expect(wrapper.find(ItemSummary)).to.have.length(0);
    });
  });

  describe("filled state", () => {
    let store, wrapper;

    beforeEach(() => {
      store = mockStore({...filledState, list: {
        ...filledState.list, selectedItemid: null,
      }});
      wrapper = mountWithL10n(
        <Provider store={store}>
          <ItemListPanel items={filledState.cache.items}
                         totalItemCount={filledState.cache.items.length}
                         onChange={() => {}}/>
        </Provider>
      );
    });

    it("render panel", () => {
      expect(wrapper).to.have.descendants(ItemFilter);
      expect(wrapper.find(ItemSummary)).to.have.length(3);
    });
  });
});
