/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import DataStore from "lockbox-datastore";
import jose from "node-jose";

const keys = {
  "encrypted": "eyJhbGciOiJQQkVTMi1IUzI1NitBMTI4S1ciLCJraWQiOiJXa3hjLUUyY0h1SDdwS244cDFDdVdKUmd1SlFiMzhSZkZKdmk3Q3VJMVg4IiwicDJjIjo4MTkyLCJwMnMiOiJQRXVSRkR3dkJIbUZ1NjA1amdFUGtSU05KTkdranpEaEVBWTdoUHc2RW9rIiwiZW5jIjoiQTI1NkdDTSJ9.mF_TyKRmlV2yL1HqFMd8GWtAw94Kl6DOd9LX_Di1d_g8AqNIJLSVaQ.AUs8cZ7P42AeyGQ0.2Uw.PA0_79GRBG1NGhiLYlaKwQ"
};

let master = {
  "kty": "oct",
  "kid": "Wkxc-E2cHuH7pKn8p1CuWJRguJQb38RfFJvi7CuI1X8",
  "k": "cmVzaW4gcGVjY2FkaWxsbyBjYXJ0YWdlIGNpcmN1bW5hdmlnYXRlIGFyaXRobWV0aWMgcmV2ZXJlbnRpYWw"
};

master = jose.util.base64url.decode(master.k).toString("utf8");

const datastore = DataStore.create({
  prompts: {unlock: () => master},
  keys: keys.encrypted
});

export default datastore;
