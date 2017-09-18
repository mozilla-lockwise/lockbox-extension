/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { MessageContext } from "fluent";
import "fluent-intl-polyfill";
import { negotiateLanguages } from "fluent-langneg";
import { LocalizationProvider } from "fluent-react";
import PropTypes from "prop-types";
import React, { Component } from "react";

async function fetchMessages(baseDir, locale) {
  const response = await fetch(`${baseDir}/${locale}/extension.ftl`);
  const messages = await response.text();

  return { [locale]: messages };
}

async function createMessagesGenerator(baseDir, currentLocales) {
  const fetched = await Promise.all(
    currentLocales.map((x) => fetchMessages(baseDir, x))
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

export default class AppLocalizationProvider extends Component {
  static get propTypes() {
    return {
      baseDir: PropTypes.string,
      availableLocales: PropTypes.array.isRequired,
      userLocales: PropTypes.array,
      children: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);

    // XXX: Pull `availableLocales` from a config file?
    const { baseDir = ".", availableLocales, userLocales } = props;
    const currentLocales = negotiateLanguages(
      userLocales, availableLocales,
      { defaultLocale: availableLocales[0] }
    );

    this.state = {
      currentLocales,
      baseDir,
    };
  }

  async componentWillMount() {
    const { baseDir, currentLocales } = this.state;
    const generateMessages = await createMessagesGenerator(
      baseDir, currentLocales
    );
    this.setState({ messages: generateMessages() });
  }

  render() {
    const { children } = this.props;
    const { messages } = this.state;

    if (!messages) {
      return <div/>;
    }

    return (
      <LocalizationProvider messages={messages}>
        {children}
      </LocalizationProvider>
    );
  }
}
