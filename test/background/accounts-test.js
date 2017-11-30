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
      const result = await accounts.loadAccount({get: async () => {
        return {account: {
          config: "dev-latest",
          info: {
            verified: true,
            uid: "1234",
          },
        }};
      }});
      expect(result.info).to.deep.equal({verified: true, uid: "1234"});
    });

    it("without saved account", async () => {
      const result = await accounts.loadAccount({get: async () => {
        return {};
      }});
      expect(result.info).to.equal(undefined);
    });
  });

  describe("openAccount()", () => {
    it("with saved account", async () => {
      const result = await accounts.openAccount({
        get: async () => {
          return {
            account: {
              config: "dev-latest",
              info: {
                verified: true,
                uid: "1234",
              },
            },
          };
        },
      });
      expect(result.info).to.deep.equal({ verified: true, uid: "1234" });
    });

    it("without saved account", async () => {
      const result = await accounts.openAccount({
        get: async () => {
          return {};
        },
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
      config: "scoped-keys",
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
    };
    const authedInfo = {
      uid: "1234",
      email: "eripley@wyutani.com",
      access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
      refresh_token: "rmrBzLYi2zia4ExNBy7uXE4s_Da_HMS4d3tvr203OVTq1EMQqh-85m4Hejo3TKBKuont6QFIlLJ23rZR4xqZBA",
      expires_at: 1825884426240000,
      id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBDWTBJb3RVVHBtWDFDbXJqMWNwcTB6aFBkd1NtalJSaWlJNzduMmMtMFkifQ.eyJ1aWQiOiIxMjM0IiwiaXNzIjoic2NvcGVkLWtleXMifQ.pX8I1LqCD849Gp0TzKcS6LM_fko0gc7wkSzBgPaxFDyF8AZrWn9-HTRoW-9YIuHujLzldbI1k34VeSHNM85vkPjm_AxbBKuXEiVJQdcCAxNjbSQmM1dOX6kZKwN4oDu8X4BB3CwQq5eXioYYiPur149O_I2bhFDuMBtQBoQosZtOScuKliXcURuWEwhYcnHe8axit0fQ0vd1FOJK3300hccqcZNoHGXrSVj42mdo_aSREOcwSUP4i0r0aCfJqnxai43uy1C5l54mSN1KzqGeasx60lWPU-Jm3gPm_2CXRWbfWxF3-OnxhMhSQiS90kefX81H03ZYVShDutsx55d0tQ",
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
        config: "scoped-keys",
        info: undefined,
      };
      expect(acct.toJSON()).to.deep.equal(expected);

      // as UNAUTHENTICATED
      acct.info = unauthedInfo;
      expected = {
        config: "scoped-keys",
        info: {
          uid: "1234",
          access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
          expires_at: undefined,
          id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBDWTBJb3RVVHBtWDFDbXJqMWNwcTB6aFBkd1NtalJSaWlJNzduMmMtMFkifQ.eyJ1aWQiOiIxMjM0IiwiaXNzIjoic2NvcGVkLWtleXMifQ.pX8I1LqCD849Gp0TzKcS6LM_fko0gc7wkSzBgPaxFDyF8AZrWn9-HTRoW-9YIuHujLzldbI1k34VeSHNM85vkPjm_AxbBKuXEiVJQdcCAxNjbSQmM1dOX6kZKwN4oDu8X4BB3CwQq5eXioYYiPur149O_I2bhFDuMBtQBoQosZtOScuKliXcURuWEwhYcnHe8axit0fQ0vd1FOJK3300hccqcZNoHGXrSVj42mdo_aSREOcwSUP4i0r0aCfJqnxai43uy1C5l54mSN1KzqGeasx60lWPU-Jm3gPm_2CXRWbfWxF3-OnxhMhSQiS90kefX81H03ZYVShDutsx55d0tQ",
        },
      };
      expect(acct.toJSON()).to.deep.equal(expected);

      // as AUTHENTICATED
      acct.info = authedInfo;
      expected = {
        config: "scoped-keys",
        info: {
          uid: "1234",
          access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
          expires_at: 1825884426240000,
          id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBDWTBJb3RVVHBtWDFDbXJqMWNwcTB6aFBkd1NtalJSaWlJNzduMmMtMFkifQ.eyJ1aWQiOiIxMjM0IiwiaXNzIjoic2NvcGVkLWtleXMifQ.pX8I1LqCD849Gp0TzKcS6LM_fko0gc7wkSzBgPaxFDyF8AZrWn9-HTRoW-9YIuHujLzldbI1k34VeSHNM85vkPjm_AxbBKuXEiVJQdcCAxNjbSQmM1dOX6kZKwN4oDu8X4BB3CwQq5eXioYYiPur149O_I2bhFDuMBtQBoQosZtOScuKliXcURuWEwhYcnHe8axit0fQ0vd1FOJK3300hccqcZNoHGXrSVj42mdo_aSREOcwSUP4i0r0aCfJqnxai43uy1C5l54mSN1KzqGeasx60lWPU-Jm3gPm_2CXRWbfWxF3-OnxhMhSQiS90kefX81H03ZYVShDutsx55d0tQ",
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

    describe("signin/out", () => {
      let stubWAF;

      async function setupMocks(withKeys) {
        let keys_jwe = "", appKeys = new Map();
        if (withKeys) {
          let k = await jose.JWK.createKeyStore().generate("oct", 256);
          appKeys.set("https://identity.mozilla.com/apps/lockbox", k);
        }

        // setup fake OAuth Authorization response
        stubWAF.callsFake(async ({url}) => {
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
        fetchMock.post("end:/v1/token", async () => ({
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
        acct = new accounts.Account({ config: "scoped-keys" });
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
        await setupMocks(false);
        const result = await acct.signIn();

        expect(result).to.have.property("uid").that.is.a("string");
      });

      it("signIn() with keys", async () => {
        const expectedKeys = await setupMocks(true);
        const result = await acct.signIn();

        expect(result).to.have.property("uid").that.is.a("string");
        expect(result).to.have.property("keys").to.have.all.keys(...expectedKeys.keys());
        expect(acct).to.have.property("keys").to.have.all.keys(...expectedKeys.keys());
      });

      it("signOut()", async () => {
        await acct.signOut();
        expect(acct.info).to.equal(undefined);
      });
    });
  });
});
