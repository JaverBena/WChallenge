const sinon = require('sinon');
const { describe, it } = require('mocha');
const authMiddleware = require('../../middlewares/auth');
const utils = require('../../lib/utils');

describe("Unit Tests to middlewares", () => {
    it("middleware ok", async () => {
        const userInfo = {
            "_id" : "61416b0655a00d86d4a8d724",
            "name" : "Javer",
            "lastName" : "Benavidez",
            "userName" : "JaverBena3",
            "password" : "$2b$10$AjjrxBiaDuq3jUOY4bAYBu9yBylgaGZIjZSRSY.PaB4uzVWXuImty",
            "currency" : "eur",
            "createdAt" : "2021-09-15T03:39:50.564Z",
            "updatedAt" : "2021-09-15T03:39:50.564Z"
        };

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);

        const req = {headers:{token:"ofbwdovb"}};
        const res = sinon.spy();
        const next = sinon.spy();

        await authMiddleware.verifyToken(req, res, next);
        sinon.assert.called(stubVerifyToken);
    });
});