/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import fetchMock from "fetch-mock";
import jose from "node-jose";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import getAccount, * as accounts from
       "src/webextension/background/accounts";

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe("background > accounts", () => {
  beforeEach(() => {
    accounts.setAccount();
  });

  it("getAccount()", () => {
    const acct = getAccount();
    expect(acct).to.be.an.instanceof(accounts.Account);
    expect(getAccount()).to.equal(acct);
  });

  describe("loadAccount()", () => {
    it("with saved account", async () => {
      const result = await accounts.loadAccount({
        get: async () => ({
          account: {
            config: "dev-latest",
            info: {
              verified: true,
              uid: "1234",
            },
          },
        }),
      });
      expect(result.info).to.deep.equal({verified: true, uid: "1234"});
    });

    it("without saved account", async () => {
      const result = await accounts.loadAccount({
        get: async () => ({}),
      });
      expect(result.info).to.equal(undefined);
    });
  });

  describe("openAccount()", () => {
    it("with saved account", async () => {
      const result = await accounts.openAccount({
        get: async () => ({
          account: {
            config: "dev-latest",
            info: {
              verified: true,
              uid: "1234",
            },
          },
        }),
      });
      expect(result.info).to.deep.equal({ verified: true, uid: "1234" });
    });

    it("without saved account", async () => {
      const result = await accounts.openAccount({
        get: async () => ({}),
      });
      expect(result.info).to.equal(undefined);
    });

    it("with error", async () => {
      const result = await accounts.openAccount({
        get: async () => {
          throw new Error("test for failure");
        },
      });
      expect(result.info).to.equal(undefined);
    });
  });

  it("saveAccount()", async () => {
    const set = sinon.stub().resolves({});
    await accounts.saveAccount({set});
    expect(set).to.have.been.calledWith({account: {
      config: "production",
      info: undefined,
    }});
  });

  it("setAccount()", () => {
    accounts.setAccount("dev-latest");
    expect(getAccount.__GetDependency__("account").config)
          .to.equal("dev-latest");

    accounts.setAccount();
    expect(getAccount.__GetDependency__("account"))
          .to.equal(undefined);
  });

  describe("Account", () => {
    let acct;
    const unauthedInfo = {
      uid: "1234",
      access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
      id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBDWTBJb3RVVHBtWDFDbXJqMWNwcTB6aFBkd1NtalJSaWlJNzduMmMtMFkifQ.eyJ1aWQiOiIxMjM0IiwiaXNzIjoic2NvcGVkLWtleXMifQ.pX8I1LqCD849Gp0TzKcS6LM_fko0gc7wkSzBgPaxFDyF8AZrWn9-HTRoW-9YIuHujLzldbI1k34VeSHNM85vkPjm_AxbBKuXEiVJQdcCAxNjbSQmM1dOX6kZKwN4oDu8X4BB3CwQq5eXioYYiPur149O_I2bhFDuMBtQBoQosZtOScuKliXcURuWEwhYcnHe8axit0fQ0vd1FOJK3300hccqcZNoHGXrSVj42mdo_aSREOcwSUP4i0r0aCfJqnxai43uy1C5l54mSN1KzqGeasx60lWPU-Jm3gPm_2CXRWbfWxF3-OnxhMhSQiS90kefX81H03ZYVShDutsx55d0tQ",
      expires_at: 0 | (Date.now() / 1000) + 1209600,
    };
    const authedInfo = {
      ...unauthedInfo,
      email: "eripley@wyutani.com",
      displayName: "Ellen Ripley",
      avatar: "https://avatars.example/92397b7d8b9e510f4266ab9751030c73b3b12cfc.png",
      refresh_token: "rmrBzLYi2zia4ExNBy7uXE4s_Da_HMS4d3tvr203OVTq1EMQqh-85m4Hejo3TKBKuont6QFIlLJ23rZR4xqZBA",
      keys: new Map(),
    };

    beforeEach(() => {
      acct = new accounts.Account({});
    });

    it("toJSON()", () => {
      let expected;

      // as GUEST
      acct.info = undefined;
      expected = {
        config: "production",
        info: undefined,
      };
      expect(acct.toJSON()).to.deep.equal(expected);

      // as UNAUTHENTICATED
      acct.info = unauthedInfo;
      expected = {
        config: "production",
        info: {
          ...unauthedInfo,
        },
      };
      expect(acct.toJSON()).to.deep.equal(expected);

      // as AUTHENTICATED
      acct.info = authedInfo;
      expected = {
        config: "production",
        info: {
          ...unauthedInfo,
          expires_at: authedInfo.expires_at,
        },
      };
      expect(acct.toJSON()).to.deep.equal(expected);
    });

    it("mode", () => {
      expect(acct.mode).to.equal(accounts.GUEST);
      acct.info = unauthedInfo;
      expect(acct.mode).to.equal(accounts.UNAUTHENTICATED);
      acct.info = authedInfo;
      expect(acct.mode).to.equal(accounts.AUTHENTICATED);
    });

    it("signedIn", () => {
      expect(acct.signedIn).to.equal(false);
      acct.info = authedInfo;
      expect(acct.signedIn).to.equal(true);
    });

    it("uid", () => {
      expect(acct.uid).to.equal(undefined);
      acct.info = authedInfo;
      expect(acct.uid).to.equal("1234");
    });

    it("email", () => {
      expect(acct.email).to.equal(undefined);
      acct.info = authedInfo;
      expect(acct.email).to.equal("eripley@wyutani.com");
    });

    it("displayName", () => {
      expect(acct.displayName).to.equal(undefined);
      acct.info = { ...authedInfo };
      expect(acct.displayName).to.equal("Ellen Ripley");
      delete acct.info.displayName;
      expect(acct.displayName).to.equal("eripley@wyutani.com");
    });

    it("avatar", () => {
      expect(acct.avatar).to.equal(browser.extension.getURL(accounts.DEFAULT_AVATAR_PATH));
      acct.info = authedInfo;
      expect(acct.avatar).to.equal("https://avatars.example/92397b7d8b9e510f4266ab9751030c73b3b12cfc.png");
    });

    it("details", () => {
      let actual;

      actual = acct.details();
      expect(actual).to.deep.equal({
        mode: accounts.GUEST,
        uid: undefined,
        email: undefined,
        displayName: undefined,
        avatar: browser.extension.getURL(accounts.DEFAULT_AVATAR_PATH),
      });
      acct.info = authedInfo;
      actual = acct.details();
      expect(actual).to.deep.equal({
        mode: accounts.AUTHENTICATED,
        uid: "1234",
        email: "eripley@wyutani.com",
        displayName: "Ellen Ripley",
        avatar: "https://avatars.example/92397b7d8b9e510f4266ab9751030c73b3b12cfc.png",
      });
    });

    describe("signin/out", () => {
      let stubWAF;

      async function setupMocks({
        withKeys = false,
        badState = false,
        missingCode = false,
      }) {
        const appKeys = new Map();
        let keys_jwe = "";

        if (withKeys) {
          const k = await jose.JWK.createKeyStore().generate("oct", 256);
          appKeys.set("https://identity.mozilla.com/apps/lockbox", k);
        }

        // setup fake OAuth Authorization response
        stubWAF.callsFake(async ({url}) => {
          url = new URL(url);
          const requestParams = url.searchParams;
          const redirect = requestParams.get("redirect_uri");
          const state = requestParams.get("state");
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

          const responseParams = new URLSearchParams();
          responseParams.set("state", !badState ? state : "thisisabogusstatevalue");
          if (!missingCode) {
            responseParams.set(
              "code",
              "7scJCX3_Dhc5cfwA3iJ32k07dJEuf3pghu4cNsH5dBXXO9h0OAQ8tHjucatkh8qQVoUiDf04r0dlv4LqkxZ-7Q"
            );
          }
          const responseURL = new URL(`${redirect}?${responseParams}`);
          return responseURL.toString();
        });

        // setup fake OAuth token response
        fetchMock.post("end:/v1/token", async () => ({
          status: 200,
          body: {
            grant_type: "bearer",
            access_token: authedInfo.access_token,
            expires_in: 1209600,
            auth_at: 1510734551,
            refresh_token: authedInfo.refresh_token,
            keys_jwe: await keys_jwe,
          },
        }));

        // setup fake profile response
        fetchMock.get("end:/v1/profile", {
          status: 200,
          body: {
            uid: "1234",
            email: "eripley@wyutani.com",
            displayName: "Ellen Ripley",
            avatar: "https://avatars.example/92397b7d8b9e510f4266ab9751030c73b3b12cfc.png",
          },
        });

        return appKeys;
      }

      before(() => {
        acct = new accounts.Account({ config: "production" });
      });

      beforeEach(async () => {
        stubWAF = sinon.stub(browser.identity, "launchWebAuthFlow");
      });
      afterEach(async () => {
        stubWAF.restore();
        fetchMock.restore();
        await acct.signOut();
      });

      it("signIn() without keys", async () => {
        await setupMocks({});
        const result = await acct.signIn();

        expect(result).to.have.property("uid").that.is.a("string");
      });

      it("signIn() with keys", async () => {
        const expectedKeys = await setupMocks({withKeys: true});
        const result = await acct.signIn();

        expect(result).to.have.property("uid").that.is.a("string");
        expect(result).to.have.property("keys").to.have.all.keys(...expectedKeys.keys());
        expect(acct).to.have.property("keys").to.have.all.keys(...expectedKeys.keys());
      });

      it("signIn() fails with invalid state", async () => {
        await setupMocks({ badState: true });

        expect(acct.signIn()).to.be.rejectedWith(Error, "invalid oauth state");
      });

      it("signIn() fails with missing code", async () => {
        await setupMocks({missingCode: true});

        expect(acct.signIn()).to.be.rejectedWith(Error, "invalid oauth authorization code");
      });

      it("light signOut()", async () => {
        acct.info = { ...authedInfo };
        await acct.signOut();
        const expected = {
          uid: authedInfo.uid,
          expires_at: authedInfo.expires_at,
          access_token: authedInfo.access_token,
          id_token: authedInfo.id_token,
        };
        expect(acct.info).to.deep.equal(expected);
      });
      it("full signOut()", async () => {
        acct.info = { ...authedInfo };
        await acct.signOut(true);
        expect(acct.info).to.equal(undefined);
      });
    });
    describe("token retrieval", () => {
      beforeEach(async () => {
        // setup fake OAuth token response
        fetchMock.post("end:/v1/token", {
          status: 200,
          body: {
            grant_type: "bearer",
            access_token: authedInfo.access_token,
            expires_in: 1209600,
            auth_at: 1510734551,
            refresh_token: authedInfo.refresh_token,
          },
        });

        // setup fake profile response
        fetchMock.get("end:/v1/profile", {
          status: 200,
          body: {
            uid: "1234",
            email: "eripley@wyutani.com",
            displayName: "Ellen Ripley",
            avatar: "https://avatars.example/92397b7d8b9e510f4266ab9751030c73b3b12cfc.png",
          },
        });
      });
      afterEach(fetchMock.restore);

      it("returns the current token", async () => {
        const expected = "G9aXls99oZnPOHfXq944vy4XL4vhkmUV9RWM1KJg6Z4";
        acct.info = {
          ...authedInfo,
          access_token: expected,
        };
        const actual = await acct.token();
        expect(acct.mode).to.equal(accounts.AUTHENTICATED);
        expect(actual).to.equal(expected);
      });
      it("returns the current token while UNAUTHENTICATED", async () => {
        const expected = "G9aXls99oZnPOHfXq944vy4XL4vhkmUV9RWM1KJg6Z4";
        acct.info = {
          ...unauthedInfo,
          access_token: expected,
        };
        const actual = await acct.token();
        expect(acct.mode).to.equal(accounts.UNAUTHENTICATED);
        expect(actual).to.equal(expected);
      });
      it("retrieves a new token when expired", async () => {
        acct.info = {
          ...authedInfo,
          access_token: "G9aXls99oZnPOHfXq944vy4XL4vhkmUV9RWM1KJg6Z4",
          expires_at: 0 | (Date.now() / 1000) - 3600,
        };
        const actual = await acct.token();
        expect(actual).to.equal(authedInfo.access_token);
        const [url, request] = fetchMock.lastCall("end:/v1/token");
        expect(url).to.match(/\/v1\/token$/);
        expect(request).to.have.property("body").with.property("grant_type").equal("refresh_token");
      });

      it("fails to refresh while UNAUTHENTICATED", async () => {
        acct.info = {
          ...unauthedInfo,
          expires_at: 0 | (Date.now() / 1000) - 3600,
        };
        try {
          await acct.token();
          expect(false, "unexpected success").to.be.ok;
        } catch (err) {
          expect(err.message).to.match(/: no refresh token$/);
        }
      });
      it("fails while GUEST", async () => {
        acct.info = {};
        try {
          await acct.token();
          expect(false, "unexpected success").to.be.ok;
        } catch (err) {
          expect(err.message).to.match(/: requires FxA$/);
        }
      });
    });
  });
});
