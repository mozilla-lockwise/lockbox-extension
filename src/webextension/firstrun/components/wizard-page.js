/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import PropTypes from "prop-types";

import Button from "../../widgets/button";

export default class WizardPage extends React.Component {
  static get propTypes() {
    return {
      title: PropTypes.string.isRequired,
      submitLabel: PropTypes.string.isRequired,
      onSubmit: PropTypes.func.isRequired,
      children: PropTypes.any,
    };
  }

  render() {
    const {title, children, submitLabel, onSubmit} = this.props;
    return (
      <article>
        <h1>{title}</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}>
          {children}
          <Button type="submit">{submitLabel}</Button>
        </form>
      </article>
    );
  }
}
