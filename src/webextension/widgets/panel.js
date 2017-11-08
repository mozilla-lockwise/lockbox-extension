/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import PropTypes from "prop-types";

import Button from "./button";

import styles from "./panel.css";

export function PanelHeader({className, onBack, children}) {
  const finalClassName = `${styles.panelHeader} ${className}`.trimRight();
  return (
    <header className={finalClassName}>
      {onBack ? <Button theme="ghost" onClick={onBack}>&lt;</Button> : null}
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
  const finalClassName = `${styles.panelBody} ${className}`.trimRight();
  return (
    <main className={finalClassName}>
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
  const finalClassName = `${styles.panelFooter} ${className}`.trimRight();
  return (
    <footer className={finalClassName}>
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

export default function Panel({className, children}) {
  const finalClassName = `${styles.panel} ${className}`.trimRight();
  return (
    <article className={finalClassName}>
      {children}
    </article>
  );
}

Panel.propTypes = {
  className: PropTypes.string,
  children(props, propName, componentName) {
    const validTypes = [PanelHeader, PanelBody, PanelFooter];
    let error = null;
    React.Children.forEach(props[propName], (child) => {
      if (!validTypes.includes(child.type)) {
        const validTypeNames = validTypes.map((i) => `\`${i.name}\``);
        error = new Error(`children should be one of ${validTypeNames}.`);
      }
    });
    return error;
  },
};

Panel.defaultProps = {
  className: "",
};
