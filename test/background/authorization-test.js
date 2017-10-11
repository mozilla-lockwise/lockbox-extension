/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

require("babel-polyfill");

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import fetchMock from "fetch-mock";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import configs from "../../src/webextension/background/authorization/configs";
import getAuthorization, * as authz from
       "../../src/webextension/background/authorization";

const config = configs["dev-latest"];

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
    it("with saved authz", async() => {
      const result = await authz.loadAuthorization({get: async() => {
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

    it("without saved authz", async() => {
      const result = await authz.loadAuthorization({get: async() => {
        return {};
      }});
      expect(result.info).to.equal(undefined);
    });
  });

  it("saveAuthorization()", async() => {
    const set = sinon.stub().resolves({});
    await authz.saveAuthorization({set});
    expect(set).to.have.been.calledWith({authz: {
      config: "dev-latest",
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

  describe("fetchFromFxa()", () => {
    const url = `${config.profile_uri}/profile`;

    it("success", async() => {
      fetchMock.get(url, "{}");
      expect(authz.fetchFromFxA("reason", url)).to.eventually.deep.equal({});
      fetchMock.restore();
    });

    it("failure", async() => {
      fetchMock.get(url, {body: "{}", status: 500});
      expect(authz.fetchFromFxA("reason", url)).to.be.rejected;
      fetchMock.restore();
    });
  });

  describe("parseAuthzResponse()", () => {
    const parseAuthzResponse = getAuthorization.__GetDependency__(
      "parseAuthzResponse"
    );

    it("return search params", () => {
      const url = "http://example.invalid?state=foo";
      const result = parseAuthzResponse(url, "foo");
      expect(result).to.be.an.instanceof(URLSearchParams);
      expect(result.toString()).to.equal("state=foo");
    });

    it("missing response parameters", () => {
      const url = "http://example.invalid";
      expect(() => parseAuthzResponse(url, null)).to.throw(
        Error, "OAUTH response parameters missing"
      );
    });

    it("mismatched OAUTH state", () => {
      const url = "http://example.invalid?state=foo";
      expect(() => parseAuthzResponse(url, "bar")).to.throw(
        Error, "OAUTH state does not match"
      );
    });
  });

  describe("Authorization", () => {
    let authorization;
    const fakeInfo = {
      verified: true,
      uid: "1234",
      email: "eripley@wyutani.com",
    };

    beforeEach(() => {
      authorization = new authz.Authorization({});
    });

    it("invalid config", () => {
      expect(() => new authz.Authorization({config: "nonexist"})).to.throw(
        Error, "unknown configuration: nonexist"
      );
    });

    it("toJSON()", () => {
      authorization.info = fakeInfo;
      expect(authorization.toJSON()).to.deep.equal({
        config: "dev-latest",
        info: {
          verified: true,
          uid: "1234",
        },
      });
    });

    it("signedIn", () => {
      expect(authorization.signedIn).to.equal(false);
      authorization.info = fakeInfo;
      expect(authorization.signedIn).to.equal(true);
    });

    it("verified", () => {
      expect(authorization.verified).to.equal(false);
      authorization.info = {...fakeInfo, verified: false};
      expect(authorization.verified).to.equal(false);
      authorization.info = fakeInfo;
      expect(authorization.verified).to.equal(true);
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

    it("signIn()", async() => {
      fetchMock.post(`${config.oauth_uri}/token`, JSON.stringify({
        auth_at: 0,
        expires_in: 0,
      }));
      fetchMock.get(`${config.profile_uri}/profile`, "{}");

      const result = await authorization.signIn();
      fetchMock.restore();

      expect(result).to.deep.equal({
        access: {
          validFrom: new Date(0).toISOString(),
          validUntil: new Date(0).toISOString(),
        },
      });
    });

    it("signOut()", async() => {
      await authorization.signOut();
      expect(authorization.info).to.equal(undefined);
    });

    describe("verify()", () => {
      it("verify user", async() => {
        fetchMock.post(`${config.fxa_auth_uri}/account/login`, "{}");
        authorization.info = fakeInfo;

        const result = await authorization.verify("password");
        fetchMock.restore();

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
