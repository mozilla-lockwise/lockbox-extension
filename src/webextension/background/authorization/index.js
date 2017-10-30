/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const DEFAULT_CONFIG = "dev-latest";

import UUID from "uuid";
import jose from "node-jose";

import configs from "./configs.json";

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
    let cfg = configs[this.config];

    // setup authorization URL
    let params = new URLSearchParams();
    let state, pkceCode;
    state = await jose.util.randomBytes(32).toString("hex");

    console.log(`redirect URI == ${browser.identity.getRedirectURL()}`);

    params.set("response_type", "code");
    params.set("client_id", cfg.client_id);
    params.set("redirect_uri", cfg.redirect_uri);
    params.set("scope", cfg.scopes.join(" "));
    params.set("state", state);
    if (cfg.pkce) {
      pkceCode = jose.util.randomBytes(32).toString("hex");
      let pkceChallenge = (new TextEncoder()).encode(pkceCode);
      pkceChallenge = await jose.JWA.digest("SHA-256", pkceChallenge);
      pkceChallenge = jose.util.base64url.encode(pkceChallenge);
      params.set("code_challenge", pkceChallenge);
      params.set("code_challenge_method", "S256");
    }

    let url, response;
    url = `${cfg.oauth_uri}/authorization?${params}`;
    response = await browser.identity.launchWebAuthFlow({
      url,
      interactive,
    });
    console.log(`authorization response: ${response}`);
    url = new URL(response);
    params = url.searchParams;
    if (params.get("state") !== state) {
      throw new Error("invalid oauth state");
    }
    let authCode = params.get("code");
    if (!authCode) {
      throw new Error("missing oauth code");
    }

    // exchange token
    let request;
    request = {
      grant_type: "authorization_code",
      code: authCode,
      code_verifier: pkceCode,
      client_id: cfg.client_id,
    };
    if (cfg.pkce) {
      request.code_verifier = pkceCode;
    } else {
      request.client_secret = cfg.client_secret;
    }
    url = `${cfg.oauth_uri}/token`;
    response = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: (new TextEncoder()).encode(JSON.stringify(request)),
    });
    let body = await response.json();
    if (!response.ok) {
      let err = new Error("oauth token error: ${body.message || response.statusText}");
      err.code = body.errno;
    }

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
