/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const DEFAULT_CONFIG = "scoped-keys";

import jose from "node-jose";

import configs from "./configs.json";

async function generateAuthzURL(config, props) {
  let queryParams = new URLSearchParams();
  queryParams.set("response_type", "code");
  queryParams.set("client_id", config.client_id);
  queryParams.set("redirect_uri", config.redirect_uri);
  queryParams.set("access_type", "offline");
  queryParams.set("scope", config.scopes.join(" "));

  let state = props.state = jose.util.randomBytes(16).toString("hex");
  queryParams.set("state", state);
  if (config.pkce) {
    props.pkce = jose.util.randomBytes(32).toString("hex");
    let challenge = new TextEncoder().encode(props.pkce);
    challenge = await jose.JWA.digest("SHA-256", challenge);
    challenge = jose.util.base64url.encode(challenge);
    queryParams.set("code_challenge", challenge);
    queryParams.set("code_challenge_method", "S256");
  }
  if (config.app_keys) {
    let keystore = jose.JWK.createKeyStore();
    props.appKey = await keystore.generate("EC", "P-256");
    let keysJWK = jose.util.base64url.encode(JSON.stringify(props.appKey));
    queryParams.set("keys_jwk", keysJWK);
  }
  return `${config.authorization_endpoint}?${queryParams}`;
}

function processAuthzResponse(url, props) {
  let queryParams = url.searchParams;
  if (queryParams.get("state") !== props.state) {
    throw new Error("invalid oauth state");
  }
  let code = queryParams.get("code");
  if (!code) {
    throw new Error("invalid oauth authorization code");
  }
  return code;
}

async function fetchFromEndPoint(name, url, request) {
  let response = await fetch(url, request);
  let body;
  try {
    body = await response.json();
  } catch (err) {
    body = {};
  }
  if (!response.ok) {
    let error = new Error(`failed ${name} request: ${body.message || response.statusText}`);
    error.errno = body.errno;
    throw error;
  }
  return body;
}

export class Authorization {
  constructor({config = DEFAULT_CONFIG, info}) {
    // TODO: verify configuration (when there is one)
    this.config = config;
    this.info = info || undefined;
  }

  toJSON() {
    let { config, info } = this;
    if (info) {
      let exported = {
        uid: info.uid,
        access_token: info.access_token || undefined,
        expires_at: info.expires_at || undefined,
        id_token: info.id_token || undefined,
      };
      info = { ...exported };
    }
    return {
      config,
      info,
    };
  }

  get signedIn() { return Boolean((this.info !== undefined) && (this.info.access_token)); }

  get uid() { return (this.info && this.info.uid) || undefined; }
  get email() { return (this.info && this.info.email) || undefined; }
  get keys() { return (this.info && this.info.keys) || new Map(); }

  get idToken() { return (this.info && this.info.id_token) || undefined; }

  async signIn(interactive = true) {
    let cfg = configs[this.config];

    let props = {},
        url,
        request;

    // request authorization
    url = await generateAuthzURL(cfg, props);
    let authzRsp = await browser.identity.launchWebAuthFlow({
      url,
      interactive,
    });
    let authzCode = processAuthzResponse(new URL(authzRsp), props);

    // exchange token
    let tokenParams = {
      grant_type: "authorization_code",
      code: authzCode,
      client_id: cfg.client_id,
    };
    if (cfg.pkce) {
      tokenParams.code_verifier = props.pkce;
    } else {
      tokenParams.client_secret = cfg.client_secret;
    }
    url = cfg.token_endpoint;
    request = {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify(tokenParams),
    };
    let oauthInfo = await fetchFromEndPoint("token", url, request);
    console.log(`oauth info == ${JSON.stringify(oauthInfo)}`);

    let keys = new Map();
    if (oauthInfo.keys_jwe) {
      let bundle = await jose.JWE.createDecrypt(props.appKey).decrypt(oauthInfo.keys_jwe);
      bundle = JSON.parse(new TextDecoder().decode(bundle.payload));
      let pending = Object.keys(bundle).map(async(name) => {
        let key = bundle[name];
        key = await jose.JWK.asKey(key);
        keys.set(name, key);
      });
      await Promise.all(pending);
    }

    // retrieve user info
    url = cfg.userinfo_endpoint;
    request = {
      method: "get",
      headers: {
        authorization: `Bearer ${oauthInfo.access_token}`,
      },
      cache: "no-cache",
    };
    let userInfo = await fetchFromEndPoint("userinfo", url, request);

    this.info = {
      uid: userInfo.uid,
      email: userInfo.email,
      access_token: oauthInfo.access_token,
      expires_at: (Date.now / 1000) + oauthInfo.expires_in,
      refresh_token: oauthInfo.refresh_token,
      id_token: oauthInfo.id_token,
      keys,
    };
    return this.info;
  }

  async signOut() {
    // TODO: something server side?
    this.info = undefined;
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
