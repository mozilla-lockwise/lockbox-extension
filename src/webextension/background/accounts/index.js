/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const DEFAULT_CONFIG = "production";

import jose from "node-jose";

import configs from "./configs.json";

async function generateAuthzURL(config, props) {
  const queryParams = new URLSearchParams();
  queryParams.set("response_type", "code");
  queryParams.set("client_id", config.client_id);
  queryParams.set("redirect_uri", config.redirect_uri);
  queryParams.set("access_type", "offline");
  queryParams.set("scope", config.scopes.join(" "));
  if (config.action) {
    queryParams.set("action", config.action);
  }

  const state = props.state = jose.util.base64url.encode(jose.util.randomBytes(16));
  queryParams.set("state", state);
  if (config.pkce) {
    props.pkce = jose.util.base64url.encode(jose.util.randomBytes(32));
    let challenge = new TextEncoder().encode(props.pkce);
    challenge = await jose.JWA.digest("SHA-256", challenge);
    challenge = jose.util.base64url.encode(challenge);
    queryParams.set("code_challenge", challenge);
    queryParams.set("code_challenge_method", "S256");
  }
  if (config.app_keys) {
    const keystore = jose.JWK.createKeyStore();
    props.appKey = await keystore.generate("EC", "P-256");
    const keysJWK = jose.util.base64url.encode(JSON.stringify(props.appKey));
    queryParams.set("keys_jwk", keysJWK);
  }
  return `${config.authorization_endpoint}?${queryParams}`;
}

function processAuthzResponse(url, props) {
  const queryParams = url.searchParams;
  if (queryParams.get("state") !== props.state) {
    throw new Error("invalid oauth state");
  }
  const code = queryParams.get("code");
  if (!code) {
    throw new Error("invalid oauth authorization code");
  }
  return code;
}

async function fetchFromEndPoint(name, url, request) {
  const response = await fetch(url, request);
  let body;
  try {
    body = await response.json();
  } catch (err) {
    body = {};
  }
  if (!response.ok) {
    const error = new Error(`failed ${name} request: ${body.message || response.statusText}`);
    error.errno = body.errno;
    throw error;
  }
  return body;
}

export const GUEST = "guest";
export const UNAUTHENTICATED = "unauthenticated";
export const AUTHENTICATED = "authenticated";

export const APP_KEY_NAME = "https://identity.mozilla.com/apps/lockbox";

export class Account {
  constructor({config = DEFAULT_CONFIG, info}) {
    // TODO: verify configuration (when there is one)
    this.config = config;
    this.info = info || undefined;
  }

  toJSON() {
    const { config } = this;
    let { info } = this;
    if (info) {
      // only exporta specific whitelist of values
      info = {
        uid: info.uid,
        access_token: info.access_token || undefined,
        expires_at: info.expires_at || undefined,
        id_token: info.id_token || undefined,
      };
    }
    return {
      config,
      info,
    };
  }

  get mode() {
    const info = this.info;
    if (!info || !info.uid) {
      return GUEST;
    }
    if (!info.refresh_token) {
      return UNAUTHENTICATED;
    }
    return AUTHENTICATED;
  }

  get signedIn() { return this.mode === AUTHENTICATED; }

  get uid() { return (this.info && this.info.uid) || undefined; }
  get email() { return (this.info && this.info.email) || undefined; }
  get displayName() { return (this.info && this.info.displayName) || this.email; }
  get avatar() { return (this.info && this.info.avatar) || undefined; }
  get keys() { return (this.info && this.info.keys) || new Map(); }

  async signIn(action = "signin") {
    let cfg = configs[this.config];

    const props = {};
    let url, request;

    // request authorization
    cfg = {
      ...cfg,
      action,
    };
    url = await generateAuthzURL(cfg, props);
    const authzRsp = await browser.identity.launchWebAuthFlow({
      url,
      interactive: true,
    });
    const authzCode = processAuthzResponse(new URL(authzRsp), props);

    // exchange token
    const tokenParams = {
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
    const oauthInfo = await fetchFromEndPoint("token", url, request);
    // console.log(`oauth info == ${JSON.stringify(oauthInfo)}`);

    const keys = new Map();
    if (oauthInfo.keys_jwe) {
      let bundle = await jose.JWE.createDecrypt(props.appKey).decrypt(oauthInfo.keys_jwe);
      bundle = JSON.parse(new TextDecoder().decode(bundle.payload));
      const pending = Object.keys(bundle).map(async (name) => {
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
    const userInfo = await fetchFromEndPoint("userinfo", url, request);

    this.info = {
      uid: userInfo.uid,
      email: userInfo.email,
      displayName: userInfo.displayName,
      avatar: userInfo.avatar,
      access_token: oauthInfo.access_token,
      expires_at: (Date.now() / 1000) + oauthInfo.expires_in,
      refresh_token: oauthInfo.refresh_token,
      id_token: oauthInfo.id_token,
      keys,
    };
    return this;
  }

  async signOut() {
    // TODO: implement a complete signout/forget
    // TODO: something server side?
    this.info = undefined;
    return this;
  }

  details() {
    return {
      mode: this.mode,
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      avatar: this.avatar,
    };
  }
}


let account;
export default function getAccount() {
  if (!account) {
    account = new Account({});
  }
  return account;
}

export async function loadAccount(storage) {
  const stored = await storage.get("account");
  if (stored && stored.account) {
    account = new Account(stored.account);
  }
  return getAccount();
}

export async function saveAccount(storage) {
  const account = getAccount().toJSON();
  await storage.set({ account });
}

export function setAccount(config, info) {
  account = config ? new Account({config, info}) : undefined;
}

export async function openAccount(storage) {
  let account;

  try {
    // attempt to load account (FxA) data
    account = await loadAccount(storage);
    // eslint-disable-next-line no-console
    console.log(`loaded account for (${account.mode.toString()}) '${account.uid || ""}'`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`loading account failed (fallback to empty GUEST): ${err.message}`);
    account = getAccount();
  }

  return account;
}
