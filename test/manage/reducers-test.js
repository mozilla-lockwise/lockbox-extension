/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";

import * as actions from "../../src/webextension/manage/actions";
import {
  cacheReducer, uiReducer,
} from "../../src/webextension/manage/reducers";

describe("reducers", () => {
  describe("cache reducer", () => {
    it("initial state", () => {
      const action = {};

      expect(cacheReducer(undefined, action)).to.deep.equal({
        items: [],
        currentItem: null,
        pendingAdd: null,
      });
    });

    it("handle LIST_ITEMS_COMPLETED", () => {
      const action = {
        type: actions.LIST_ITEMS_COMPLETED,
        items: [
          {id: "1", title: "title 1"},
          {id: "2", title: "title 2"},
        ],
      };

      expect(cacheReducer(undefined, action)).to.deep.equal({
        items: action.items,
        currentItem: null,
        pendingAdd: null,
      });
    });

    describe("handle ADD_ITEM_*", () => {
      it("handle ADD_ITEM_STARTING", () => {
        const action = {
          type: actions.ADD_ITEM_STARTING,
          actionId: 0,
          item: {
            title: "title",
            origins: ["origin.com"],
            entry: {
              kind: "login",
              username: "username",
              password: "password",
              notes: "notes",
            },
          },
        };

        expect(cacheReducer(undefined, action)).to.deep.equal({
          items: [],
          currentItem: null,
          pendingAdd: action.actionId,
        });
      });

      it("handle ADD_ITEM_COMPLETED (direct)", () => {
        const state = {
          items: [],
          currentItem: null,
          pendingAdd: 0,
        };
        const action = {
          type: actions.ADD_ITEM_COMPLETED,
          actionId: 0,
          item: {
            title: "title",
            origins: ["origin.com"],
            id: "1",
            entry: {
              kind: "login",
              username: "username",
              password: "password",
              notes: "notes",
            },
          },
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [{
            id: action.item.id,
            title: action.item.title,
            origins: action.item.origins,
            username: action.item.entry.username,
          }],
          currentItem: action.item,
          pendingAdd: null,
        });
      });

      it("handle ADD_ITEM_COMPLETED (indirect)", () => {
        const state = {
          items: [],
          currentItem: null,
          pendingAdd: 1,
        };
        const action = {
          type: actions.ADD_ITEM_COMPLETED,
          actionId: 0,
          item: {
            title: "title",
            origins: ["origin.com"],
            id: "1",
            entry: {
              kind: "login",
              username: "username",
              password: "password",
              notes: "notes",
            },
          },
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [{
            id: action.item.id,
            title: action.item.title,
            username: action.item.entry.username,
            origins: action.item.origins,
          }],
          currentItem: null,
          pendingAdd: 1,
        });
      });
    });

    describe("handle UPDATE_ITEM_COMPLETED", () => {
      it("selected", () => {
        const state = {
          items: [
            {id: "1", title: "original title"},
            {id: "2", title: "another title"},
          ],
          currentItem: {
            title: "original title",
            id: "1",
            origins: ["original-origin.com"],
            entry: {
              kind: "login",
              username: "original username",
              password: "original password",
              notes: "original notes",
            },
          },
          pendingAdd: null,
        };
        const action = {
          type: actions.UPDATE_ITEM_COMPLETED,
          actionId: 0,
          item: {
            title: "updated title",
            id: "1",
            origins: ["updated-origin.com"],
            entry: {
              kind: "login",
              username: "updated username",
              password: "updated password",
              notes: "updated notes",
            },
          },
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [
            {
              id: action.item.id,
              title: action.item.title,
              username: action.item.entry.username,
              origins: action.item.origins,
            },
            state.items[1],
          ],
          currentItem: action.item,
          pendingAdd: null,
        });
      });

      it("unselected", () => {
        const state = {
          items: [
            {id: "1", title: "original title", username: "original username",
             origins: ["original-origin.com"]},
            {id: "2", title: "another title", username: "another username",
             origins: ["another-origin.com"]},
          ],
          currentItem: null,
          pendingAdd: null,
        };
        const action = {
          type: actions.UPDATE_ITEM_COMPLETED,
          actionId: 0,
          item: {
            title: "updated title",
            id: "1",
            origins: ["updated-origin.com"],
            entry: {
              kind: "login",
              username: "updated username",
              password: "updated password",
              notes: "updated notes",
            },
          },
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [
            {
              id: action.item.id,
              title: action.item.title,
              username: action.item.entry.username,
              origins: action.item.origins,
            },
            state.items[1],
          ],
          currentItem: null,
          pendingAdd: null,
        });
      });
    });

    describe("handle REMOVE_ITEM_COMPLETED", () => {
      it("selected", () => {
        const state = {
          items: [{id: "1", title: "title", username: "username",
                   origins: ["origin.com"]}],
          currentItem: {
            title: "title",
            id: "1",
            origins: ["origin.com"],
            entry: {
              kind: "login",
              username: "username",
              password: "password",
              notes: "notes",
            },
          },
          pendingAdd: null,
        };
        const action = {
          type: actions.REMOVE_ITEM_COMPLETED,
          actionId: 0,
          id: "1",
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [],
          currentItem: null,
          pendingAdd: null,
        });
      });

      it("unselected", () => {
        const state = {
          items: [
            {id: "1", title: "title", username: "username",
             origins: ["origin.com"]},
            {id: "2", title: "other title", username: "another username",
             origins: ["another-origin.com"]},
          ],
          currentItem: {
            title: "title",
            id: "1",
            origins: ["origin.com"],
            entry: {
              kind: "login",
              username: "username",
              password: "password",
              notes: "notes",
            },
          },
          pendingAdd: null,
        };
        const action = {
          type: actions.REMOVE_ITEM_COMPLETED,
          actionId: 0,
          id: "2",
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [state.items[0]],
          currentItem: state.currentItem,
          pendingAdd: null,
        });
      });
    });

    it("handle SELECT_ITEM_COMPLETED", () => {
      const state = {
        items: [{id: "1", title: "title"}],
        currentItem: null,
        pendingAdd: null,
      };
      const action = {
        type: actions.SELECT_ITEM_COMPLETED,
        item: {
          title: "title",
          id: "1",
          origins: ["origin.com"],
          entry: {
            kind: "login",
            username: "username",
            password: "password",
            notes: "notes",
          },
        },
      };

      expect(cacheReducer(state, action)).to.deep.equal({
        items: state.items,
        currentItem: action.item,
        pendingAdd: null,
      });
    });
  });

  describe("ui reducer", () => {
    it("initial state", () => {
      expect(uiReducer(undefined, {})).to.deep.equal({
        newItem: false,
        selectedItemId: null,
        filter: [],
      });
    });

    it("handle START_NEW_ITEM", () => {
      const action = {
        type: actions.START_NEW_ITEM,
      };

      expect(uiReducer(undefined, action)).to.deep.equal({
        newItem: true,
        selectedItemId: null,
        filter: [],
      });
    });

    it("handle CANCEL_NEW_ITEM", () => {
      const state = {
        newItem: true,
        selectedItemId: null,
        filter: [],
      };
      const action = {
        type: actions.CANCEL_NEW_ITEM,
      };

      expect(uiReducer(state, action)).to.deep.equal({
        newItem: false,
        selectedItemId: null,
        filter: [],
      });
    });

    it("handle ADD_ITEM_COMPLETED", () => {
      const state = {
        newItem: true,
        selectedItemId: null,
        filter: [],
      };
      const action = {
        type: actions.ADD_ITEM_COMPLETED,
        item: {
          id: "1",
        },
      };

      expect(uiReducer(state, action)).to.deep.equal({
        newItem: false,
        selectedItemId: "1",
        filter: [],
      });
    });

    it("handle SELECT_ITEM_STARTING", () => {
      const state = {
        newItem: false,
        selectedItemId: null,
        filter: [],
      };
      const action = {
        type: actions.SELECT_ITEM_STARTING,
        id: "1",
      };

      expect(uiReducer(state, action)).to.deep.equal({
        newItem: false,
        selectedItemId: "1",
        filter: [],
      });
    });

    it("handle FILTER_ITEMS", () => {
      const state = {
        newItem: false,
        filter: [],
      };
      const action = {
        type: actions.FILTER_ITEMS,
        filter: ["my filter"],
      };

      expect(uiReducer(state, action)).to.deep.equal({
        newItem: false,
        filter: ["my filter"],
      });
    });
  });
});
