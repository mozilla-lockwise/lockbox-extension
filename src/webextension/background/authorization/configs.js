/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const CONFIGS = {
  "dev-latest": {
    client_id: "1b024772203a0849",
    client_secret: "490a88c97e8229d68f2d3410015f3851262ec610489f8393d6de0ae5bf2de162",
    redirect_uri: "https://2aa95473a5115d5f3deb36bb6875cf76f05e4c4d.extensions.allizom.org/",
    oauth_uri: "https://oauth-latest.dev.lcip.org/v1",
    profile_uri: "https://latest.dev.lcip.org/profile/v1",
    fxa_auth_uri: "https://latest.dev.lcip.org/auth/v1",
    scopes: ["profile", "https://identity.mozilla.org/apps/lockbox"],
    pkce: true,
  },
};
export default CONFIGS;
