/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { MessageContext } from "fluent";
import "fluent-intl-polyfill";
import { negotiateLanguages } from "fluent-langneg";
import { LocalizationProvider } from "fluent-react";
import PropTypes from "prop-types";
import React, { Component } from "react";

async function fetchAvailableLocales(baseDir) {
  try {
    const response = await fetch(`${baseDir}/locales.json`);
    return response.json();
  } catch (e) {
    throw new Error("unable to fetch available locales");
  }
}

async function fetchMessages(baseDir, locale, bundle) {
  try {
    const response = await fetch(`${baseDir}/${locale}/${bundle}.ftl`);
    const messages = await response.text();

    return { [locale]: messages };
  } catch (e) {
    throw new Error(`unable to fetch localization for ${locale}`);
  }
}

async function createMessagesGenerator(baseDir, currentLocales, bundle) {
  const fetched = await Promise.all(
    currentLocales.map((x) => fetchMessages(baseDir, x, bundle))
  );
  const bundles = fetched.reduce(
    (obj, cur) => Object.assign(obj, cur)
  );

  return function* generateMessages() {
    for (const locale of currentLocales) {
      const cx = new MessageContext(locale);
      cx.addMessages(bundles[locale]);
      yield cx;
    }
  }
}

export default class AppLocalizationProvider extends Component {
  static get propTypes() {
    return {
      baseDir: PropTypes.string,
      userLocales: PropTypes.arrayOf(PropTypes.string),
      bundle: PropTypes.string.isRequired,
      children: PropTypes.any,
    };
  }

  static get defaultProps() {
    return {
      baseDir: "/locales",
      userLocales: [],
    };
  }

  constructor(props) {
    super(props);
    const { baseDir, userLocales, bundle } = props;

    this.state = {
      baseDir,
      userLocales,
      bundle,
    };
  }

  async componentWillMount() {
    const { baseDir, userLocales, bundle } = this.state;

    const availableLocales = await fetchAvailableLocales(baseDir);
    const currentLocales = negotiateLanguages(
      userLocales, availableLocales,
      { defaultLocale: availableLocales[0] }
    );

    const generateMessages = await createMessagesGenerator(
      baseDir, currentLocales, bundle
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
