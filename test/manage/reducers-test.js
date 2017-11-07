/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect } from "chai";

import * as actions from "src/webextension/manage/actions";
import {
  cacheReducer, listReducer, editorReducer, modalReducer,
} from "src/webextension/manage/reducers";
import { NEW_ITEM_ID } from "src/webextension/manage/common";

describe("manage > reducers", () => {
  describe("cache reducer", () => {
    it("initial state", () => {
      const action = {};

      expect(cacheReducer(undefined, action)).to.deep.equal({
        items: [],
        currentItem: null,
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
        });
      });

      it("handle ADD_ITEM_COMPLETED (interactive)", () => {
        const state = {
          items: [],
          currentItem: null,
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
          interactive: true,
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [{
            id: action.item.id,
            title: action.item.title,
            origins: action.item.origins,
            username: action.item.entry.username,
          }],
          currentItem: action.item,
        });
      });

      it("handle ADD_ITEM_COMPLETED (non-interactive)", () => {
        const state = {
          items: [],
          currentItem: null,
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
          interactive: false,
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [{
            id: action.item.id,
            title: action.item.title,
            username: action.item.entry.username,
            origins: action.item.origins,
          }],
          currentItem: null,
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
        };
        const action = {
          type: actions.REMOVE_ITEM_COMPLETED,
          actionId: 0,
          id: "1",
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [],
          currentItem: null,
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
        };
        const action = {
          type: actions.REMOVE_ITEM_COMPLETED,
          actionId: 0,
          id: "2",
        };

        expect(cacheReducer(state, action)).to.deep.equal({
          items: [state.items[0]],
          currentItem: state.currentItem,
        });
      });
    });

    it("handle SELECT_ITEM_COMPLETED", () => {
      const state = {
        items: [{id: "1", title: "title"}],
        currentItem: null,
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
      });
    });

    it("handle START_NEW_ITEM", () => {
      const state = {
        items: [
          {id: "1", title: "title", username: "username",
           origins: ["origin.com"]},
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
      };
      const action = {
        type: actions.START_NEW_ITEM,
      };

      expect(cacheReducer(state, action)).to.deep.equal({
        items: state.items,
        currentItem: null,
      });
    });
  });

  describe("list reducer", () => {
    it("initial state", () => {
      expect(listReducer(undefined, {})).to.deep.equal({
        selectedItemId: null,
        filter: "",
      });
    });

    describe("handle ADD_ITEM_COMPLETED", () => {
      it("interactive", () => {
        const action = {
          type: actions.ADD_ITEM_COMPLETED,
          actionId: 0,
          item: {
            id: "1",
          },
          interactive: true,
        };

        expect(listReducer(undefined, action)).to.deep.equal({
          selectedItemId: "1",
          filter: "",
        });
      });

      it("non-interactive", () => {
        const action = {
          type: actions.ADD_ITEM_COMPLETED,
          actionId: 0,
          item: {
            id: "1",
          },
          interactive: false,
        };

        expect(listReducer(undefined, action)).to.deep.equal({
          selectedItemId: null,
          filter: "",
        });
      });
    });

    it("handle SELECT_ITEM_STARTING", () => {
      const action = {
        type: actions.SELECT_ITEM_STARTING,
        actionId: 0,
        id: "1",
      };

      expect(listReducer(undefined, action)).to.deep.equal({
        selectedItemId: "1",
        filter: "",
      });
    });

    it("handle START_NEW_ITEM", () => {
      const action = {
        type: actions.START_NEW_ITEM,
      };

      expect(listReducer(undefined, action)).to.deep.equal({
        selectedItemId: NEW_ITEM_ID,
        filter: "",
      });
    });

    describe("handle CANCEL_EDITING", () => {
      it("new item", () => {
        const state = {
          selectedItemId: NEW_ITEM_ID,
          filter: "",
        };
        const action = {
          type: actions.CANCEL_EDITING,
        };

        expect(listReducer(state, action)).to.deep.equal({
          selectedItemId: null,
          filter: "",
        });
      });

      it("existing item", () => {
        const state = {
          selectedItemId: "1",
          filter: "",
        };
        const action = {
          type: actions.CANCEL_EDITING,
        };

        expect(listReducer(state, action)).to.deep.equal({
          selectedItemId: "1",
          filter: "",
        });
      });
    });

    it("handle FILTER_ITEMS", () => {
      const action = {
        type: actions.FILTER_ITEMS,
        filter: "my filter",
      };

      expect(listReducer(undefined, action)).to.deep.equal({
        selectedItemId: null,
        filter: "my filter",
      });
    });
  });

  describe("editor reducer", () => {
    it("initial state", () => {
      expect(editorReducer(undefined, {})).to.deep.equal({
        editing: false,
        changed: false,
        hideHome: false,
      });
    });

    describe("handle ADD_ITEM_COMPLETED", () => {
      it("interactive", () => {
        const state = {
          editing: true,
          changed: true,
          hideHome: false,
        };
        const action = {
          type: actions.ADD_ITEM_COMPLETED,
          actionId: 0,
          item: { id: "1" },
          interactive: true,
        };

        expect(editorReducer(state, action)).to.deep.equal({
          editing: false,
          changed: false,
          hideHome: false,
        });
      });

      it("non-interactive", () => {
        const state = {
          editing: true,
          changed: true,
          hideHome: false,
        };
        const action = {
          type: actions.ADD_ITEM_COMPLETED,
          actionId: 0,
          item: { id: "1" },
          interactive: false,
        };

        expect(editorReducer(state, action)).to.deep.equal({
          editing: true,
          changed: true,
          hideHome: false,
        });
      });
    });

    describe("handle UPDATE_ITEM_COMPLETED", () => {
      it("interactive", () => {
        const state = {
          editing: true,
          changed: true,
          hideHome: false,
        };
        const action = {
          type: actions.UPDATE_ITEM_COMPLETED,
          actionId: 0,
          item: { id: "1" },
          interactive: true,
        };

        expect(editorReducer(state, action)).to.deep.equal({
          editing: false,
          changed: false,
          hideHome: false,
        });
      });

      it("non-interactive", () => {
        const state = {
          editing: true,
          changed: true,
          hideHome: false,
        };
        const action = {
          type: actions.UPDATE_ITEM_COMPLETED,
          actionId: 0,
          item: { id: "1" },
          interactive: false,
        };

        expect(editorReducer(state, action)).to.deep.equal({
          editing: true,
          changed: true,
          hideHome: false,
        });
      });
    });

    describe("handle SELECT_ITEM_*", () => {
      it("handle SELECT_ITEM_STARTING (not editing)", () => {
        const state = {
          editing: false,
          changed: false,
          hideHome: false,
        };
        const action = {
          type: actions.SELECT_ITEM_STARTING,
          actionId: 0,
          id: "1",
        };

        expect(editorReducer(state, action)).to.deep.equal({
          editing: false,
          changed: false,
          hideHome: false,
        });
      });

      it("handle SELECT_ITEM_STARTING (editing)", () => {
        const state = {
          editing: true,
          changed: true,
          hideHome: false,
        };
        const action = {
          type: actions.SELECT_ITEM_STARTING,
          actionId: 0,
          id: "1",
        };

        expect(editorReducer(state, action)).to.deep.equal({
          editing: false,
          changed: false,
          hideHome: true,
        });
      });

      it("handle SELECT_ITEM_COMPLETED", () => {
        const state = {
          editing: false,
          changed: false,
          hideHome: true,
        };
        const action = {
          type: actions.SELECT_ITEM_COMPLETED,
          actionId: 0,
          item: { id: "1" },
        };

        expect(editorReducer(state, action)).to.deep.equal({
          editing: false,
          changed: false,
          hideHome: false,
        });
      });
    });

    it("handle START_NEW_ITEM", () => {
      const action = {
        type: actions.START_NEW_ITEM,
      };

      expect(editorReducer(undefined, action)).to.deep.equal({
        editing: true,
        changed: false,
        hideHome: false,
      });
    });

    it("handle EDIT_CURRENT_ITEM", () => {
      const action = {
        type: actions.EDIT_CURRENT_ITEM,
      };

      expect(editorReducer(undefined, action)).to.deep.equal({
        editing: true,
        changed: false,
        hideHome: false,
      });
    });

    it("handle EDITOR_CHANGED", () => {
      const state = {
        editing: true,
        changed: false,
        hideHome: false,
      };
      const action = {
        type: actions.EDITOR_CHANGED,
      };

      expect(editorReducer(state, action)).to.deep.equal({
        editing: true,
        changed: true,
        hideHome: false,
      });
    });

    it("handle CANCEL_EDITING", () => {
      const state = {
        editing: true,
        changed: true,
        hideHome: false,
      };
      const action = {
        type: actions.CANCEL_EDITING,
      };

      expect(editorReducer(state, action)).to.deep.equal({
        editing: false,
        changed: false,
        hideHome: false,
      });
    });
  });

  describe("modal reducer", () => {
    it("initial state", () => {
      expect(modalReducer(undefined, {})).to.deep.equal({
        id: null,
        props: null,
      });
    });

    it("handle SHOW_MODAL", () => {
      const action = {
        type: actions.SHOW_MODAL,
        id: "my_modal",
        props: {prop: "value"},
      };

      expect(modalReducer(undefined, action)).to.deep.equal({
        id: "my_modal",
        props: {prop: "value"},
      });
    });

    it("handle HIDE_MODAL", () => {
      const state = {
        id: "my_modal",
        props: {prop: "value"},
      };
      const action = {
        type: actions.HIDE_MODAL,
      };

      expect(modalReducer(state, action)).to.deep.equal({
        id: null,
        props: null,
      });
    });
  });
});
