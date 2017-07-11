/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const EXPORTED_SYMBOLS = ["AboutModule", "ComponentFactory"];

const {interfaces: Ci, manager: Cm, results: Cr, utils: Cu} = Components;

Cm.QueryInterface(Ci.nsIComponentRegistrar);
Cu.import("resource://gre/modules/Services.jsm");

class AboutModule {
  get _aboutURI() {
    return "chrome://lockbox/content/aboutPage.html";
  }

  static get classID() {
    return Components.ID("{72360f7e-ca0a-4eed-aaa0-aca4b63ecb94}");
  }

  static get classDescription() {
    return "A page to manage Lockbox's stored accounts";
  }

  static get contractID() {
    return "@mozilla.org/network/protocol/about;1?what=lockbox";
  }

  static get QueryInterface() {
    return XPCOMUtils.generateQI([Ci.nsIAboutModule]);
  }

  constructor() {
    Object.freeze(this);
  }

  getURIFlags(aURI) {
    return Ci.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT |
           Ci.nsIAboutModule.MAKE_LINKABLE |
           Ci.nsIAboutModule.ALLOW_SCRIPT;
  }

  newChannel(aURI, aLoadInfo) {
    let channel = Services.io.newChannelFromURIWithLoadInfo(
      Services.io.newURI(this._aboutURI, null, null), aLoadInfo
    );
    channel.originalURI = aURI;
    return channel;
  }
}

class ComponentFactory {
  constructor(component) {
    this.component = component;
    this.register();
    Object.freeze(this);
  }

  createInstance(outer, iid) {
    if (outer) {
      throw Cr.NS_ERROR_NO_AGGREGATION;
    }
    return new this.component();
  }

  register() {
    Cm.registerFactory(this.component.classID,
                       this.component.classDescription,
                       this.component.contractID,
                       this);
  }

  unregister() {
    Cm.unregisterFactory(this.component.classID, this);
  }
}
