/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import PropTypes from "prop-types";
import React from "react";

import ItemList, { ItemListPlaceholder } from "../../components/item-list";

export default function ManageItemList({totalItemCount, ...props}) {
  if (props.items.length === 0) {
    return (
      <Localized id={`all-items-${totalItemCount ? "no-results" :
                                                   "get-started"}`}>
        <ItemListPlaceholder>
          wHEn yOu cREATe an eNTRy...
        </ItemListPlaceholder>
      </Localized>
    );
  }
  return (
    <ItemList {...props}/>
  );
}

ManageItemList.propTypes = {
  totalItemCount: PropTypes.number.isRequired,
  ...ItemList.propTypes,
};
