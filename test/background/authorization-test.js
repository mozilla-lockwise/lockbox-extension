/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import fetchMock from "fetch-mock";
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
      keys: {},
    };

    beforeEach(() => {
      authorization = new authz.Authorization({});
    });

    it("toJSON()", () => {
      authorization.info = fakeInfo;
      expect(authorization.toJSON()).to.deep.equal({
        config: "scoped-keys",
        info: {
          uid: "1234",
          access_token: "KhDtmS0a98vx6fe0HB0XhrtXEuYtB6nDF6aC-rwbufnYvQDgTnvxzZlFyHjB5fcF95AGi2TysUUyXBbprHIQ9g",
        },
      });
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

    it("signIn()", async () => {
      const result = await authorization.signIn();
      fetchMock.restore();

      expect(result).to.have.property("uid").that.is.a("string");
    });

    it("signOut()", async () => {
      await authorization.signOut();
      expect(authorization.info).to.equal(undefined);
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
