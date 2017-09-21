/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./scrolling-list.css";

export default class ScrollingList extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.func.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }).isRequired
      ).isRequired,
      tabIndex: PropTypes.string,
      selected: PropTypes.string,
      onItemSelected: PropTypes.func.isRequired,
    };
  }

  static get defaultProps() {
    return {
      tabIndex: "0",
      selected: null,
    };
  }

  handleKeyDown(e) {
    if (this.props.data.length === 0) {
      return;
    }
    let currentIndex, newIndex;

    switch (e.key) {
    case "ArrowDown":
      currentIndex = this._getCurrentIndex();
      if (currentIndex === -1) {
        newIndex = 0;
      } else if (currentIndex < this.props.data.length - 1) {
        newIndex = currentIndex + 1;
      }
      break;
    case "ArrowUp":
      currentIndex = this._getCurrentIndex();
      if (currentIndex === -1) {
        newIndex = 0;
      } else if (currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
      break;
    default:
      return;
    }

    if (newIndex !== undefined) {
      this.props.onItemSelected(this.props.data[newIndex].id);
      e.stopPropagation();
      e.preventDefault();
    }
  }

  _getCurrentIndex() {
    return this.props.data.findIndex((i) => i.id === this.props.selected);
  }

  render() {
    const {children, data, tabIndex, selected, onItemSelected} = this.props;
    return (
      <ul tabIndex={tabIndex} className={styles.scrollingList}
          onKeyDown={(e) => this.handleKeyDown(e)}>
        {data.map((item) => children({
          item,
          key: item.id,
          selected: item.id === selected,
          onClick: () => onItemSelected(item.id),
        }))}
      </ul>
    );
  }
}
