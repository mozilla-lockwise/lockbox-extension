/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const CONFIGS = {
  "dev-stable": {
    client_id: "6b7245cb84132a90",
    client_secret: "bc56d58f7996e5f40db8e1c05f61e745cd4e0664cb4d1f3f787667bcca3e4e79",
    redirect_uri: "https://2aa95473a5115d5f3deb36bb6875cf76f05e4c4d.extensions.allizom.org/",
    oauth_uri: "https://oauth-stable.dev.lcip.org/v1",
    profile_uri: "https://stable.dev.lcip.org/profile/v1",
    scopes: ["profile"],
    fxa_auth_uri: "https://stable.dev.lcip.org/auth/v1",
    pkce: true,
  },
};
export default CONFIGS;
