/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import { PanelBanner } from "../../../widgets/panel";
import ItemList, { ItemListPlaceholder } from "../../components/item-list";

const MAX_VERBOSE_ITEMS = 2;

import styles from "./popup-item-list.css";

export default class PopupItemList extends React.Component {
  static get propTypes() {
    return {
      items: ItemList.propTypes.items,
      noResultsBanner: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      noResultsBanner: false,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      selected: null,
    };
  }

  handleChange(selected) {
    this.setState({selected});
  }

  render() {
    const {items, noResultsBanner, ...props} = this.props;
    if (items.length === 0) {
      return (
        <Localized id="all-items-no-results">
          <ItemListPlaceholder>
            no rESULTs
          </ItemListPlaceholder>
        </Localized>
      );
    }

    const {selected} = this.state;
    const verbose = items.length <= MAX_VERBOSE_ITEMS;
    return (
      <div className={styles.itemListContainer}>
        {noResultsBanner && (
          <Localized id="no-results-banner">
            <PanelBanner>no rESULTs</PanelBanner>
          </Localized>
        )}
        <ItemList {...props} items={items} className={styles.itemList}
                  verbose={verbose} selected={selected}
                  onChange={(s) => this.handleChange(s)}/>
      </div>
    );
  }
}
