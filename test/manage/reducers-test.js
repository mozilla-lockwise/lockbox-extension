/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import { expect } from "chai";

import * as actions from "../../src/webextension/manage/actions";
import {
  cacheReducer, uiReducer
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
            entry: {
              kind: "login",
              username: "username",
              password: "password",
            }
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
            id: "1",
            entry: {
              kind: "login",
              username: "username",
              password: "password",
            }
          },
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [{id: action.item.id, title: action.item.title}],
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
            id: "1",
            entry: {
              kind: "login",
              username: "username",
              password: "password",
            }
          },
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [{id: action.item.id, title: action.item.title}],
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
            entry: {
              kind: "login",
              username: "original username",
              password: "original password",
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
            entry: {
              kind: "login",
              username: "updated username",
              password: "updated password",
            },
          },
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [
            {id: action.item.id, title: action.item.title},
            state.items[1],
          ],
          currentItem: action.item,
          pendingAdd: null,
        });
      });

      it("unselected", () => {
        const state = {
          items: [
            {id: "1", title: "original title"},
            {id: "2", title: "another title"},
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
            entry: {
              kind: "login",
              username: "updated username",
              password: "updated password",
            },
          },
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [
            {id: action.item.id, title: action.item.title},
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
          items: [{id: "1", title: "title"}],
          currentItem: {
            title: "title",
            id: "1",
            entry: {
              kind: "login",
              username: "username",
              password: "password",
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
            {id: "1", title: "title"},
            {id: "2", title: "other title"},
          ],
          currentItem: {
            title: "title",
            id: "1",
            entry: {
              kind: "login",
              username: "username",
              password: "password",
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
          entry: {
            kind: "login",
            username: "username",
            password: "password",
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
      });
    });

    it("handle START_NEW_ITEM", () => {
      const action = {
        type: actions.START_NEW_ITEM,
      };

      expect(uiReducer(undefined, action)).to.deep.equal({
        newItem: true,
      });
    });

    it("handle CANCEL_NEW_ITEM", () => {
      const state = {
        newItem: true,
      };
      const action = {
        type: actions.CANCEL_NEW_ITEM,
      };

      expect(uiReducer(state, action)).to.deep.equal({
        newItem: false,
      });
    });

    it("handle ADD_ITEM_COMPLETED", () => {
      const state = {
        newItem: true,
      };
      const action = {
        type: actions.ADD_ITEM_COMPLETED,
      };

      expect(uiReducer(state, action)).to.deep.equal({
        newItem: false,
      });
    });
  });
});
