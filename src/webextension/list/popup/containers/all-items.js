/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";
import { connect } from "react-redux";

import { selectItem, copiedField } from "../../actions";
import { parseFilterString, filterItem } from "../../filter";
import ItemList, { ItemListPlaceholder } from "../../components/item-list";

const MAX_VERBOSE_ITEMS = 2;
const collator = new Intl.Collator();

class AllItems extends React.Component {
  static get propTypes() {
    return {
      items: ItemList.propTypes.items,
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
    const itemCount = this.props.items.length;
    if (itemCount === 0) {
      return (
        <Localized id="all-items-no-results">
          <ItemListPlaceholder>
            no rESULTs
          </ItemListPlaceholder>
        </Localized>
      );
    }

    const {selected} = this.state;
    const verbose = itemCount <= MAX_VERBOSE_ITEMS;
    return (
      <ItemList {...this.props} verbose={verbose}
                selected={selected} onChange={(s) => this.handleChange(s)}/>
    );
  }
}

export default connect(
  (state) => {
    const filter = parseFilterString(state.list.filter);
    const items = state.cache.items
                       .filter((i) => filterItem(filter, i))
                       .sort((a, b) => collator.compare(a.title, b.title));
    return {items};
  },
  (dispatch) => ({
    onClick: (id) => { dispatch(selectItem(id)); },
    onCopy: (field) => { dispatch(copiedField(field)); },
  }),
)(AllItems);
