/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-modal";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import mountWithL10n from "test/mocks/l10n";
import { initialState } from "../mock-redux-state";
import ModalRoot from "src/webextension/manage/containers/modal-root";
import CancelEditingModal from
       "src/webextension/manage/containers/modals/cancel-editing";
import DeleteItemModal from
       "src/webextension/manage/containers/modals/delete-item";
import * as actions from "src/webextension/manage/actions";

chai.use(sinonChai);

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("manage > containers > modals", () => {
  describe("<ModalRoot/>", () => {
    beforeEach(() => {
      // Enzyme doesn't support React Portals yet; see
      // <https://github.com/airbnb/enzyme/issues/1150>.
      ModalRoot.__Rewire__("Modal", class FakeModal extends React.Component {
        static get propTypes() {
          return {
            children: PropTypes.node,
          };
        }

        render() {
          return <div>{this.props.children}</div>;
        }
      });
    });

    afterEach(() => {
      ModalRoot.__ResetDependency__("Modal");
    });

    it("no modal", () => {
      const store = mockStore(initialState);
      const wrapper = mountWithL10n(
        <Provider store={store}>
          <ModalRoot/>
        </Provider>
      );
      expect(wrapper.find(Modal)).to.have.length(0);
    });

    it("with modal", () => {
      const store = mockStore({
        ...initialState,
        modal: { id: "cancel", props: null },
      });
      const wrapper = mountWithL10n(
        <Provider store={store}>
          <ModalRoot/>
        </Provider>
      );

      expect(wrapper.find(CancelEditingModal)).to.have.length(1);
    });

    it("hideModal() dispatched when closing modal", () => {
      const store = mockStore({
        ...initialState,
        modal: { id: "cancel", props: null },
      });
      const wrapper = mountWithL10n(
        <Provider store={store}>
          <ModalRoot/>
        </Provider>
      );

      wrapper.find("button").last().simulate("click");
      expect(store.getActions()).to.deep.equal([
        { type: actions.HIDE_MODAL },
      ]);
    });
  });

  describe("<CancelEditingModal/>", () => {
    let store, wrapper, onClose;

    beforeEach(() => {
      onClose = sinon.spy();
      store = mockStore(initialState);
      wrapper = mountWithL10n(
        <Provider store={store}>
          <CancelEditingModal onClose={onClose}/>
        </Provider>
      );
    });

    it("cancelEditing() dispatched and onClose() called", () => {
      wrapper.find("button").first().simulate("click");
      expect(store.getActions()).to.deep.equal([
        { type: actions.CANCEL_EDITING },
      ]);
      expect(onClose).to.have.been.calledWith();
    });

    it("onClose() called", () => {
      wrapper.find("button").last().simulate("click");
      expect(store.getActions()).to.deep.equal([]);
      expect(onClose).to.have.been.calledWith();
    });
  });

  describe("<DeleteItemModal/>", () => {
    let store, wrapper, onClose;

    beforeEach(() => {
      onClose = sinon.spy();
      store = mockStore({
        ...initialState,
        modal: { id: null, props: {id: "1"} },
      });
      wrapper = mountWithL10n(
        <Provider store={store}>
          <DeleteItemModal onClose={onClose}/>
        </Provider>
      );
    });

    it("removeItem() dispatched and onClose() called", () => {
      wrapper.find("button").first().simulate("click");
      const dispatched = store.getActions();
      expect(dispatched[0]).to.deep.equal({
        type: actions.REMOVE_ITEM_STARTING,
        actionId: dispatched[0].actionId,
        id: "1",
      });
      expect(onClose).to.have.been.calledWith();
    });

    it("onClose() called", () => {
      wrapper.find("button").last().simulate("click");
      expect(store.getActions()).to.deep.equal([]);
      expect(onClose).to.have.been.calledWith();
    });
  });
});
