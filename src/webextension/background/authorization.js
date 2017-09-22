/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import jose from "node-jose";

const OAUTH_CLIENT_ID = "6b7245cb84132a90";
const OAUTH_CLIENT_SECRET = "bc56d58f7996e5f40db8e1c05f61e745cd4e0664cb4d1f3f787667bcca3e4e79";
const OAUTH_REDIRECT_URI = "https://2aa95473a5115d5f3deb36bb6875cf76f05e4c4d.extensions.allizom.org/";
const OAUTH_URL_PREFIX = "https://oauth-stable.dev.lcip.org/v1";
const OAUTH_PROFILE_URI = "https://stable.dev.lcip.org/profile/v1";
const OAUTH_SCOPES = ["profile"];
const FXA_URI_PREFIX = "https://stable.dev.lcip.org/auth/v1";

function toQuery(params) {
  let query = Object.keys(params).map((k) => {
    let v = params[k];
    return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
  });
  return query.join("&");
}
function fromQuery(query) {
  let params = {};
  query.substring(1).split("&").forEach((p) => {
    let [k, v] = p.split("=");
    params[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return params;
}

async function makeAuthzRequest(state, challenge) {
  let code;
  code = (new TextEncoder()).encode(challenge);
  code = await jose.JWA.digest("SHA-256", code);
  code = jose.util.base64url.encode(code);

  let query = toQuery({
    "client_id": OAUTH_CLIENT_ID,
    "state": state,
    "redirect_uri": OAUTH_REDIRECT_URI,
    "scope": OAUTH_SCOPES.join(" "),
    "access_type": "offline",
    "code_challenge": code,
    "code_challenge_method": "S256",
  });

  return `${OAUTH_URL_PREFIX}/authorization?${query}`;
}
function parseAuthzResponse(url, state) {
  url = new URL(url);

  let search = url.search;
  if (!search) {
    throw new Error("OAUTH response parameters missing");
  }

  let params = fromQuery(search);
  if (params.state !== state) {
    throw new Error("OAUTH state does not match");
  }

  return params;
}

async function requestIt(reason, url, config) {
  let response = await fetch(url, config);
  let body = await response.json();
  if (!response.ok) {
    // body is FxA error response
    console.log(`${reason} request failed: ${JSON.stringify(body)}`);
    let err = new Error(`${reason} request failed: ${body.message}`);
    Object.assign(err, {
      code: err.code,
      errno: err.errno,
    });
    throw err;
  }
  return body;
}

async function fetchToken(code, challenge) {
  let params = {
    grant_type: "authorization_code",
    client_id: OAUTH_CLIENT_ID,
    client_secret: OAUTH_CLIENT_SECRET,
    verifier_code: challenge,
    code,
  };

  let response = await requestIt("OAUTH token", `${OAUTH_URL_PREFIX}/token`, {
    method: "post",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    cache: "no-cache",
  });
  return response;
}

async function fetchProfile(token) {
  let response = await requestIt("profile", `${OAUTH_PROFILE_URI}/profile`, {
    method: "get",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-cache",
  });
  return response;
}

/**
 * Perform the authorization request.
 */
export async function signIn(interactive = false) {
  let state = jose.util.base64url.encode(jose.util.randomBytes(16)),
      challenge = jose.util.base64url.encode(jose.util.randomBytes(32));

  // authz request/response
  let url = await makeAuthzRequest(state, challenge);
  let response = await browser.identity.launchWebAuthFlow({
    url,
    interactive,
  });
  response = parseAuthzResponse(response, state);

  // token request/response
  response = await fetchToken(response.code, challenge);
  let oauth = response;

  response = await fetchProfile(oauth.access_token);
  let profile = response;

  return {
    uid: profile.uid,
    email: profile.email,
    token: oauth.access_token,
    offline: oauth.refresh_token || "",
    expires: new Date((oauth.auth_at + oauth.expires_in) * 1000),
  };
}

async function calculateCredentials(email, password) {
  const NAMESPACE = "identity.mozilla.com/picl/v1/";
  const PBKDF2 = {
    iterations: 1000,
    length: 32,
  };
  const HKDF = {
    salt: new Uint8Array([0]),
    length: 32,
  };

  function utf8(input) {
    return new Buffer(input, "utf8");
  }
  function kw(name) {
    return utf8(`${NAMESPACE}${name}`);
  }
  function kwe(name, email) {
    return utf8(`R{NAMESPACE}${name}:${email}`);
  }

  let authPW = await Promise.resolve(utf8(password || "")).
    then((password) => {
      let params = {
        ...PBKDF2,
        salt: kwe("quickStretch", email),
      };
      return jose.JWA.derive("PBKDF2-SHA-256", password, params);
    }).
    then((quickStretchedPW) => {
      let params = {
        ...HKDF,
        info: kw("authPW"),
      }
      return jose.JWA.derive("HKDF-SHA-256", quickStretchedPW, params);
    });

  authPW = authPW.toString("hex");
  return {
    email,
    authPW,
  };
}

/**
 * Verify a user's credentials by logging into FxA
 */
export async function verify(email, password) {
  let creds = await calculateCredentials(email, password);
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let response = await fetch(`${FXA_URI_PREFIX}/account/login`, {
    method: "post",
    headers,
    body: JSON.stringify(creds),
  });
  // regardless of success/error, there should be a JSON body
  let body = await response.json();
  if (!response.ok) {
    let err = new Error("verification failed");
    Object.assign(err, {
      code: body.code,
      errno: body.errno,
      reason: body.message,
    });
  }

  // TODO: do something with the body?
  return password;
}
