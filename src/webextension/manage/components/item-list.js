/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import ItemSummary from "./item-summary";
import ScrollingList from "../../widgets/scrolling-list";

export default function ItemList({items, selected, onItemSelected}) {
  return (
    <ScrollingList data={items} selected={selected}
                   onItemSelected={onItemSelected}>
      {({title, username}) => {
        return (
          <ItemSummary title={title} username={username}/>
        );
      }}
    </ScrollingList>
  );
}

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  selected: PropTypes.string,
  onItemSelected: PropTypes.func.isRequired,
};
