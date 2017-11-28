/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import fetchMock from "fetch-mock";
import jose from "node-jose";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import getAuthorization, * as authz from
       "src/webextension/background/authorization";

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe("background > authorization", () => {
  beforeEach(() => {
    authz.setAuthorization();
  });

  it("getAuthorization()", () => {
    const authorization = getAuthorization();
    expect(authorization).to.be.an.instanceof(authz.Authorization);
    expect(getAuthorization()).to.equal(authorization);
  });

  describe("loadAuthorization()", () => {
    it("with saved authz", async () => {
      const result = await authz.loadAuthorization({get: async () => {
        return {authz: {
          config: "dev-latest",
          info: {
            verified: true,
            uid: "1234",
          },
        }};
      }});
      expect(result.info).to.deep.equal({verified: true, uid: "1234"});
    });

    it("without saved authz", async () => {
      const result = await authz.loadAuthorization({get: async () => {
        return {};
      }});
      expect(result.info).to.equal(undefined);
    });
  });

  it("saveAuthorization()", async () => {
    const set = sinon.stub().resolves({});
    await authz.saveAuthorization({set});
    expect(set).to.have.been.calledWith({authz: {
      config: "scoped-keys",
      info: undefined,
    }});
  });

  it("setAuthorization()", () => {
    authz.setAuthorization("dev-latest");
    expect(getAuthorization.__GetDependency__("authorization").config)
          .to.equal("dev-latest");

    authz.setAuthorization();
    expect(getAuthorization.__GetDependency__("authorization"))
          .to.equal(undefined);
  });

  describe("Authorization", () => {
    let authorization;
    const fakeInfo = {
      uid: "1234",
      email: "eripley@wyutani.com",
      access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
      refresh_token: "rmrBzLYi2zia4ExNBy7uXE4s_Da_HMS4d3tvr203OVTq1EMQqh-85m4Hejo3TKBKuont6QFIlLJ23rZR4xqZBA",
      expires_at: 1209600 * 1509494400,
      id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBDWTBJb3RVVHBtWDFDbXJqMWNwcTB6aFBkd1NtalJSaWlJNzduMmMtMFkifQ.eyJ1aWQiOiIxMjM0IiwiaXNzIjoic2NvcGVkLWtleXMifQ.pX8I1LqCD849Gp0TzKcS6LM_fko0gc7wkSzBgPaxFDyF8AZrWn9-HTRoW-9YIuHujLzldbI1k34VeSHNM85vkPjm_AxbBKuXEiVJQdcCAxNjbSQmM1dOX6kZKwN4oDu8X4BB3CwQq5eXioYYiPur149O_I2bhFDuMBtQBoQosZtOScuKliXcURuWEwhYcnHe8axit0fQ0vd1FOJK3300hccqcZNoHGXrSVj42mdo_aSREOcwSUP4i0r0aCfJqnxai43uy1C5l54mSN1KzqGeasx60lWPU-Jm3gPm_2CXRWbfWxF3-OnxhMhSQiS90kefX81H03ZYVShDutsx55d0tQ",
      keys: {},
    };

    beforeEach(() => {
      authorization = new authz.Authorization({});
    });

    it("toJSON()", () => {
      authorization.info = fakeInfo;
      const expected = {
        config: "scoped-keys",
        info: {
          uid: "1234",
          access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
          expires_at: 1509494400 * 1209600,
          id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBDWTBJb3RVVHBtWDFDbXJqMWNwcTB6aFBkd1NtalJSaWlJNzduMmMtMFkifQ.eyJ1aWQiOiIxMjM0IiwiaXNzIjoic2NvcGVkLWtleXMifQ.pX8I1LqCD849Gp0TzKcS6LM_fko0gc7wkSzBgPaxFDyF8AZrWn9-HTRoW-9YIuHujLzldbI1k34VeSHNM85vkPjm_AxbBKuXEiVJQdcCAxNjbSQmM1dOX6kZKwN4oDu8X4BB3CwQq5eXioYYiPur149O_I2bhFDuMBtQBoQosZtOScuKliXcURuWEwhYcnHe8axit0fQ0vd1FOJK3300hccqcZNoHGXrSVj42mdo_aSREOcwSUP4i0r0aCfJqnxai43uy1C5l54mSN1KzqGeasx60lWPU-Jm3gPm_2CXRWbfWxF3-OnxhMhSQiS90kefX81H03ZYVShDutsx55d0tQ",
        },
      };
      const actual = authorization.toJSON();
      expect(actual).to.deep.equal(expected);
    });

    it("signedIn", () => {
      expect(authorization.signedIn).to.equal(false);
      authorization.info = fakeInfo;
      expect(authorization.signedIn).to.equal(true);
    });

    it("uid", () => {
      expect(authorization.uid).to.equal(undefined);
      authorization.info = fakeInfo;
      expect(authorization.uid).to.equal("1234");
    });

    it("email", () => {
      expect(authorization.email).to.equal(undefined);
      authorization.info = fakeInfo;
      expect(authorization.email).to.equal("eripley@wyutani.com");
    });

    describe("signin/out", () => {
      let stubWAF;

      async function setupMocks(withKeys) {
        let keys_jwe = "", appKeys = new Map();
        if (withKeys) {
          let k = await jose.JWK.createKeyStore().generate("oct", 256);
          appKeys.set("https://identity.mozilla.com/apps/lockbox", k);
        }

        // setup fake OAuth Authorization response
        stubWAF.callsFake(async({ url }) => {
          url = new URL(url);
          let requestParams = url.searchParams;
          let redirect = requestParams.get("redirect_uri");
          let state = requestParams.get("state");
          let peerECDH = requestParams.get("keys_jwk");

          if (withKeys && peerECDH) {
            peerECDH = JSON.parse(jose.util.base64url.decode(peerECDH).toString("utf8"));
            let payload = {};
            for (let [n, k] of appKeys) {
              payload[n] = JSON.stringify(k.toJSON(true));
            }
            payload = JSON.stringify(payload);
            keys_jwe = jose.JWE.createEncrypt({ format: "compact" }, peerECDH).final(payload, "utf8");
          }

          let responseParams = new URLSearchParams();
          responseParams.set("state", state);
          responseParams.set("code", "7scJCX3_Dhc5cfwA3iJ32k07dJEuf3pghu4cNsH5dBXXO9h0OAQ8tHjucatkh8qQVoUiDf04r0dlv4LqkxZ-7Q");
          let responseURL = new URL(`${redirect}?${responseParams}`);
          return responseURL.toString();
        });

        // setup fake OAuth token response
        fetchMock.post("end:/v1/token", async() => ({
          status: 200,
          body: {
            grant_type: "bearer",
            access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
            expires_in: 1209600,
            auth_at: 1510734551,
            refresh_token: "rmrBzLYi2zia4ExNBy7uXE4s_Da_HMS4d3tvr203OVTq1EMQqh-85m4Hejo3TKBKuont6QFIlLJ23rZR4xqZBA",
            keys_jwe: await keys_jwe,
          },
        }));

        // setup fake profile response
        fetchMock.get("end:/v1/profile", {
          status: 200,
          body: {
            uid: "1234",
            email: "eripley@wyutani.com",
          },
        });

        return appKeys;
      }

      before(() => {
        authorization = new authz.Authorization({ config: "scoped-keys" });
      });

      beforeEach(async() => {
        stubWAF = sinon.stub(browser.identity, "launchWebAuthFlow");
      });
      afterEach(async() => {
        stubWAF.restore();
        fetchMock.restore();
        await authorization.signOut();
      });

      it("signIn() without keys", async() => {
        await setupMocks(false);
        const result = await authorization.signIn();

        expect(result).to.have.property("uid").that.is.a("string");
      });

      it("signIn() with keys", async() => {
        const expectedKeys = await setupMocks(true);
        const result = await authorization.signIn();

        expect(result).to.have.property("uid").that.is.a("string");
        expect(result).to.have.property("keys").to.have.all.keys(...expectedKeys.keys());
        expect(authorization).to.have.property("keys").to.have.all.keys(...expectedKeys.keys());
      });

      it("signOut()", async() => {
        await authorization.signOut();
        expect(authorization.info).to.equal(undefined);
      });
    });

    describe("verify()", () => {
      it("verify user", async () => {
        authorization.info = fakeInfo;

        const result = await authorization.verify("password");

        expect(result).to.equal("password");
        expect(authorization.verified).to.equal(true);
      });

      it("fail when not signed in", () => {
        expect(authorization.verify("password")).to.be.rejectedWith(
          Error, "not signed in"
        );
      });
    });
  });
});
