/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import PropTypes from "prop-types";
import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

import { initialState } from "../mock-redux-state";
import mountWithL10n from "test/mocks/l10n";
import App from "src/webextension/manage/components/app";
import AddItem from "src/webextension/manage/containers/add-item";
import AllItems from "src/webextension/manage/containers/all-items";
import CurrentSelection from
       "src/webextension/manage/containers/current-selection";
import ModalRootWidget from "src/webextension/widgets/modal-root";

chai.use(chaiEnzyme());

const middlewares = [];
const mockStore = configureStore(middlewares);

describe("manage > components > <App/>", () => {
  beforeEach(() => {
    // Enzyme doesn't support React Portals yet; see
    // <https://github.com/airbnb/enzyme/issues/1150>.
    ModalRootWidget.__Rewire__(
      "Modal", class FakeModal extends React.Component {
        static get propTypes() {
          return {
            children: PropTypes.node,
          };
        }

        render() {
          return <div>{this.props.children}</div>;
        }
      }
    );
  });

  afterEach(() => {
    ModalRootWidget.__ResetDependency__("Modal");
  });

  it("render app", () => {
    const store = mockStore(initialState);
    const wrapper = mountWithL10n(
      <Provider store={store}>
        <App/>
      </Provider>
    );

    expect(wrapper).to.contain(<AddItem/>);
    expect(wrapper).to.contain(<AllItems/>);
    expect(wrapper).to.contain(<CurrentSelection/>);
  });
});
