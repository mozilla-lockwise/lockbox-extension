/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const DEFAULT_CONFIG = "dev-latest";

import UUID from "uuid";

export class Authorization {
  constructor({config = DEFAULT_CONFIG, info}) {
    // TODO: verify configuration (when there is one)
    this.config = config;
    this.info = info || undefined;
  }

  toJSON() {
    let { config, info } = this;
    if (info) {
      info = { ...info };
      delete info.email;
    }
    return {
      config,
      info,
    };
  }

  get signedIn() { return this.info !== undefined; }
  get verified() { return (this.info && this.info.verified) || false; }

  get uid() { return (this.info && this.info.uid) || undefined; }
  get email() { return (this.info && this.info.email) || undefined; }

  async signIn(interactive = true) {
    let uid = UUID();
    this.info = {
      uid,
    };
    return this.info;
  }

  async signOut() {
    // TODO: something server side?
    this.info = undefined;
  }

  async verify(password) {
    if (!this.signedIn) {
      throw new Error("not signed in");
    }

    // TODO: do something real!
    this.info.verified = true;

    return password;
  }
}

let authorization;
export default function getAuthorization() {
  if (!authorization) {
    authorization = new Authorization({});
  }
  return authorization;
}

export async function loadAuthorization(storage) {
  let stored = await storage.get("authz");
  if (stored && stored.authz) {
    authorization = new Authorization(stored.authz);
  }
  return getAuthorization();
}

export async function saveAuthorization(storage) {
  let authz = getAuthorization().toJSON();
  await storage.set({ authz });
}

export function setAuthorization(config, info) {
  authorization = config ? new Authorization({config, info}) : undefined;
}
