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

export const DEFAULT_AVATAR_PATH = "icons/default-avatar.svg";

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
  get avatar() {
    return (this.info && this.info.avatar) ||
           browser.extension.getURL(DEFAULT_AVATAR_PATH);
  }

  get keys() { return (this.info && this.info.keys) || new Map(); }

  async signIn(action = "signin") {
    let cfg = configs[this.config];

    const props = {};
    let url;

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
    await this.updateAccessToken(tokenParams, props.appKey);

    // update user info
    await this.updateUserInfo();

    return this;
  }

  async signOut(full = false) {
    if (full) {
      // forget everything
      this.info = undefined;
    } else if (this.info) {
      // light touch -- whitelist
      const info = this.info;
      this.info = {
        uid: info.uid,
        access_token: info.access_token,
        expires_at: info.expires_at,
        id_token: info.id_token,
      };
    }
    // XXXX: something server side?

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

  async token() {
    // always return null if user is GUEST
    if (this.mode === GUEST) {
      // XXXX: use DataStoreError
      throw new Error("AUTH: requires FxA");
    }

    // check if token present / unexpired / valid
    let info = await this.updateUserInfo();
    if (!info || !info.access_token) {
      // refresh
      await this.updateAccessToken();
      info = await this.updateUserInfo();
    }

    if (!info || !info.access_token) {
      // XXXX: use DataStoreError
      throw new Error("AUTH: no access token");
    }

    return info.access_token;
  }


  async updateAccessToken(params, appKey) {
    const cfg = configs[this.config];
    let info = this.info || {};

    if (!params) {
      // assume "refresh_token" exchange
      if (!info.refresh_token) {
        // XXXX: use DataStoreError
        throw new Error("AUTH: no refresh token");
      }

      params = {
        grant_type: "refresh_token",
        refresh_token: info.refresh_token,
        client_id: cfg.client_id,
      };
    }

    const request = {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify(params),
    };
    const oauthInfo = await fetchFromEndPoint("token", cfg.token_endpoint, request);
    let keys = info.keys || new Map();
    if (oauthInfo.keys_jwe && appKey) {
      // forget previous keys before decrypting new bundle
      keys.clear();

      let bundle = await jose.JWE.createDecrypt(appKey).decrypt(oauthInfo.keys_jwe);
      bundle = JSON.parse(new TextDecoder().decode(bundle.payload));
      const pending = Object.keys(bundle).map(async (name) => {
        let key = bundle[name];
        key = await jose.JWK.asKey(key);
        keys.set(name, key);
      });
      await Promise.all(pending);
    }

    this.info = info = {
      ...info,
      access_token: oauthInfo.access_token,
      expires_at: 0 | (Date.now() / 1000) + oauthInfo.expires_in,
      id_token: oauthInfo.id_token,
      refresh_token: oauthInfo.refresh_token,
      keys,
    };

    return info;
  }

  async updateUserInfo() {
    let info = this.info || {};
    const { access_token, expires_at } = info;
    if (!access_token || !expires_at || Date.now() > (expires_at * 1000)) {
      // need a new access token
      return null;
    }

    const url = configs[this.config].userinfo_endpoint;
    const request = {
      method: "get",
      headers: {
        "authorization": `Bearer ${access_token}`,
      },
      cache: "no-cache",
    };
    try {
      const userInfo = await fetchFromEndPoint("userinfo", url, request);
      // since it's present ... update user info
      this.info = info = {
        ...info,
        uid: userInfo.uid,
        email: userInfo.email,
        displayName: userInfo.displayName,
        avatar: userInfo.avatar,
      };
    } catch (err) {
      return null;
    }

    return info;
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
