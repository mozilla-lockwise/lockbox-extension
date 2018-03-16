/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Localized } from "fluent-react";
import React from "react";
import PropTypes from "prop-types";

import { classNames } from "../common";
import Button from "./button";

import buttonStyles from "./button.css";
import styles from "./panel.css";

export function PanelHeader({className, onBack, children}) {
  const imgSrc = browser.extension.getURL("/icons/arrowhead-left-16.svg");
  return (
    <header className={classNames([styles.panelHeader, className])}>
      {onBack ? (
        <Button theme="ghost" size="micro" onClick={onBack}>
          <Localized id="panel-back-button">
            <img src={imgSrc} alt="go bACk"/>
          </Localized>
        </Button>
      ) : null}
      <span>{children}</span>
    </header>
  );
}

PanelHeader.propTypes = {
  className: PropTypes.string,
  onBack: PropTypes.func,
  children: PropTypes.node,
};

PanelHeader.defaultProps = {
  className: "",
};

export function PanelBody({className, children}) {
  return (
    <main className={classNames([styles.panelBody, className])}>
      {children}
    </main>
  );
}

PanelBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

PanelBody.defaultProps = {
  className: "",
};

export function PanelFooter({className, children}) {
  return (
    <footer className={classNames([styles.panelFooter, className])}>
      {children}
    </footer>
  );
}

PanelFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

PanelFooter.defaultProps = {
  className: "",
};

const THEME_CLASS_NAME = {
  primary: `${styles.primaryTheme}`,
  normal: `${styles.normalTheme}`,
};

export class PanelFooterButton extends React.Component {
  static get propTypes() {
    return {
      theme: PropTypes.oneOf(Object.keys(THEME_CLASS_NAME)),
      className: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      theme: "normal",
      className: "",
    };
  }

  focus() {
    this.buttonElement.focus();
  }

  render() {
    const {theme, className, ...props} = this.props;
    return (
      <button {...props} className={classNames([
                buttonStyles.button, styles.panelFooterButton,
                THEME_CLASS_NAME[theme], className,
              ])} ref={(element) => this.buttonElement = element}/>
    );
  }
}

export default function Panel({className, children}) {
  return (
    <article className={classNames([styles.panel, className])}>
      {children}
    </article>
  );
}

Panel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Panel.defaultProps = {
  className: "",
};
