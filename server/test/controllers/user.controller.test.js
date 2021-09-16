const sinon = require('sinon');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const userController = require('../../controllers/user.controller');
const mongoServices = require('../../services/mongo.service');
const authServices = require('../../services/auth.service');

describe("Unit Tests to User Controller", () => {

    let stubVerifyUserName;

    beforeEach(() => {
        stubVerifyUserName = sinon.stub(mongoServices, "verifyUserName");
    });

    afterEach(() => {
        stubVerifyUserName.restore();
    });

    it("Create user OK", async () => {

        stubVerifyUserName.resolves(false);
        let stubSaveUser = sinon.stub(mongoServices, "saveUser");
        let stubAddUserCoins = sinon.stub(mongoServices, "addUserCoins");

        const userReq = {
            "name": "Javer",
            "lastName": "Gomez",
            "userName": "JaverGomez",
            "password": "JaverGomez",
            "currency": "EUR"
        };

        const value = await userController.createUser(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
        sinon.assert.called(stubSaveUser);
        sinon.assert.called(stubAddUserCoins);
    });

    it("User already created", async () => {

        stubVerifyUserName.resolves({succes: true});

        const userReq = {
            "name": "Javer",
            "lastName": "Gomez",
            "userName": "JaverGomez",
            "password": "JaverGomez",
            "currency": "EUR"
        };

        const value = await userController.createUser(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
    });

    it("catch creating new user", async () => {

        stubVerifyUserName.rejects("Error creating new user");

        const userReq = {
            "name": "Javer",
            "lastName": "Gomez",
            "userName": "JaverGomez",
            "password": "JaverGomez",
            "currency": "EUR"
        };

        const value = await userController.createUser(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
    });

    it("catch error encypting pass", async () => {

        stubVerifyUserName.resolves(false);
        let stubEncryptPassword = sinon.stub(authServices, "encryptPassword")
            .rejects("Error encrypting pass");

        const userReq = {
            "name": "Javer",
            "lastName": "Gomez",
            "userName": "JaverGomez",
            "password": "JaverGomez",
            "currency": "EUR"
        };

        const value = await userController.createUser(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
        sinon.assert.called(stubEncryptPassword);
    });

    it("catch error general create user", async () => {

        const userReq = false;
        const value = await userController.createUser(userReq);
        expect(value).to.not.be.undefined;
    });

    it("Generate token (login) OK", async () => {

        stubVerifyUserName.resolves({succes: true});
        let stubComparePass = sinon.stub(authServices, "comparePass")
            .resolves(true);

        const userReq = {
            "userName": "JaverGomez",
            "password": "JaverGomez"
        };

        const value = await userController.login(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
        sinon.assert.called(stubComparePass);
        stubComparePass.restore();
        stubComparePass.restore();
    });

    it("User does not exist", async () => {

        stubVerifyUserName.resolves(false);

        const userReq = {
            "userName": "JaverGomez",
            "password": "JaverGomez"
        };

        const value = await userController.login(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
    });

    it("Incorrect pass", async () => {

        stubVerifyUserName.resolves(true);
        let stubComparePass = sinon.stub(authServices, "comparePass")
            .resolves(false);

        const userReq = {
            "userName": "JaverGomez",
            "password": "JaverGomez"
        };

        const value = await userController.login(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
        sinon.assert.called(stubComparePass);
        stubComparePass.restore();
    });

    it("catch error comparing pass", async () => {

        stubVerifyUserName.resolves(true);
        let stubComparePass = sinon.stub(authServices, "comparePass")
            .rejects("Error comparing pass");

        const userReq = {
            "userName": "JaverGomez",
            "password": "JaverGomez"
        };

        const value = await userController.login(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
        sinon.assert.called(stubComparePass);
    });

    it("catch error checking userName", async () => {

        stubVerifyUserName.rejects("Error checking userName");

        const userReq = {
            "userName": "JaverGomez",
            "password": "JaverGomez"
        };

        const value = await userController.login(userReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyUserName);
    });

    it("catch error general login", async () => {
        const userReq = null;
        const value = await userController.login(userReq);
        expect(value).to.not.be.undefined;
    });
})