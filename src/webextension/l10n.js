/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { Component } from "react";
import PropTypes from "prop-types";

import "fluent-intl-polyfill/compat";
import { MessageContext } from "fluent/compat";
import { LocalizationProvider } from "fluent-react/compat";
import negotiateLanguages from "fluent-langneg/compat";

async function fetchMessages(locale) {
  const response = await fetch(`${locale}.ftl`);
  const messages = await response.text();

  return { [locale]: messages };
}

async function createMessagesGenerator(currentLocales) {
  const fetched = await Promise.all(
    currentLocales.map(fetchMessages)
  );
  const bundle = fetched.reduce(
    (obj, cur) => Object.assign(obj, cur)
  );

  return function* generateMessages() {
    for (const locale of currentLocales) {
      const cx = new MessageContext(locale);
      cx.addMessages(bundle[locale]);
      yield cx;
    }
  }
}

export class AppLocalizationProvider extends Component {
  static get propTypes() {
    return {
      userLocales: PropTypes.array,
      children: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);

    const { userLocales } = props;
    const currentLocales = negotiateLanguages(
      userLocales, ["en-US"],
      { defaultLocale: "en-US" }
    );

    this.state = {
      currentLocales,
    };
  }

  async componentWillMount() {
    const { currentLocales } = this.state;
    const generateMessages = await createMessagesGenerator(currentLocales);
    this.setState({ messages: generateMessages() });
  }

  render() {
    const { children } = this.props;
    const { messages } = this.state;

    if (!messages) {
      return <div>…</div>;
    }

    return (
      <LocalizationProvider messages={messages}>
        {children}
      </LocalizationProvider>
    );
  }
}
