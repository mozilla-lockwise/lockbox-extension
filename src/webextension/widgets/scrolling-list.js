/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import PropTypes from "prop-types";
import React from "react";

import styles from "./scrolling-list.css";

export default class ScrollingList extends React.Component {
  static get propTypes() {
    return {
      className: PropTypes.string,
      itemClassName: PropTypes.string,
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
      className: "",
      itemClassName: "",
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
      currentIndex = this.getCurrentIndex();
      if (currentIndex === -1) {
        newIndex = 0;
      } else if (currentIndex < this.props.data.length - 1) {
        newIndex = currentIndex + 1;
      }
      break;
    case "ArrowUp":
      currentIndex = this.getCurrentIndex();
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
    }
    e.stopPropagation();
    e.preventDefault();
  }

  getCurrentIndex() {
    return this.props.data.findIndex((i) => i.id === this.props.selected);
  }

  scrollIntoViewIfNeeded(item) {
    const root = this._rootElement;

    const overlapsTop = (item.offsetTop - root.offsetTop) < root.scrollTop;
    const overlapsBottom = (
      item.offsetTop + item.clientHeight - root.offsetTop
    ) > (root.scrollTop + root.clientHeight);

    if (overlapsTop) {
      item.scrollIntoView({behavior: "smooth", block: "start"});
    } else if (overlapsBottom) {
      item.scrollIntoView({behavior: "smooth", block: "end"});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected && this.props.selected !== prevProps.selected) {
      this.scrollIntoViewIfNeeded(this._selectedElement);
    }
  }

  render() {
    const { className, itemClassName, children, data, tabIndex, selected,
            onItemSelected } = this.props;
    const finalClassName = `${styles.scrollingList} ${className}`
                           .trimRight();

    return (
      <ul tabIndex={tabIndex} className={finalClassName}
          ref={(element) => this._rootElement = element}
          onKeyDown={(e) => this.handleKeyDown(e)}>
        {data.map((item) => {
          let props = {
            onMouseDown: () => onItemSelected(item.id),
            className: itemClassName,
          };
          if (item.id === selected) {
            Object.assign(props, {
              "data-selected": true,
              "ref": (element) => this._selectedElement = element,
            });
          }

          return (
            <li key={item.id} {...props}>
              {children(item)}
            </li>
          );
        })}
      </ul>
    );
  }
}
