const sinon = require('sinon');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const coinsController = require('../../controllers/coins.controller');
const coinServices = require('../../services/coins.service');
const mongoServices = require('../../services/mongo.service');
const utils = require('../../lib/utils');

describe("Unit Tests to Coins Controller", () => {
    
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

    const userCoinsInfo = {
        "_id" : "61416b0655a00d86d4a8d726",
        "name" : "Javer",
        "lastName" : "Benavidez",
        "userName" : "JaverBena3",
        "currency" : "eur",
        "coins" : [ 
            {
                "coinName" : "bit",
                "quantity" : 24
            }, 
            {
                "coinName" : "bit2",
                "quantity" : 1
            }, 
            {
                "coinName" : "bit3",
                "quantity" : 3.9
            }, 
            {
                "coinName" : "bit4",
                "quantity" : 6
            }, 
            {
                "coinName" : "Bitcoin",
                "quantity" : 1
            }, 
            {
                "coinName" : "bit5",
                "quantity" : 2
            }, 
            {
                "coinName" : "Tether",
                "quantity" : 3
            }
        ],
        "favoriteCoins" : [ 
            {
                "id" : "bitcoin",
                "coinName" : "Bitcoin"
            }, 
            {
                "id" : "ethereum",
                "coinName" : "Ethereum"
            }, 
            {
                "id" : "cardano",
                "coinName" : "Cardano"
            }, 
            {
                "id" : "tether",
                "coinName" : "Tether"
            }
        ],
        "createdAt" : "2021-09-15T03:39:50.599Z",
        "updatedAt" : "2021-09-16T02:48:12.123Z"
    };

    it("Get Market Coin list OK", async () => {
        const coinReq = {
            "currency": "EUR"
        };
        const value = await coinsController.getCoinsListController(coinReq);
        expect(value).to.not.be.undefined;
    });

    it("catch error getting Market Coin list", async () => {
        const stubGetCoinsService = sinon.stub(coinServices, "getCoinsService")
            .rejects("Error getting Market Coin list");

        const coinReq = {
            "currency": "EUR"
        };

        const value = await coinsController.getCoinsListController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubGetCoinsService);
        stubGetCoinsService.restore();
    });

    it("catch error general getCoinsListController ", async () => {
        const coinReq = null;
        const value = await coinsController.getCoinsListController(coinReq);
        expect(value).to.not.be.undefined;
    });

    it("Add Coins (only quantity) OK", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo);
        let stubAddCoins = sinon.stub(mongoServices, "addCoins")
            .resolves({succes: true});

        const coinReq = {
            "userName": "JaverBena3",
            "coinName": "Bitcoin",
            "quantity": 2
        };

        const value = await coinsController.addCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        sinon.assert.called(stubAddCoins);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubAddCoins.restore();
    });

    it("Add Coins OK", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo);
        let stubAddCoins = sinon.stub(mongoServices, "addCoins")
            .resolves({succes: true});

        const coinReq = {
            "userName": "JaverBena3",
            "coinName": "Bitcoin1",
            "quantity": 2
        };

        const value = await coinsController.addCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        sinon.assert.called(stubAddCoins);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubAddCoins.restore();
    });

    it("Catch error token no valido", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(false);

        const coinReq = {
            "userName": "JaverBena3",
            "coinName": "Bitcoin",
            "quantity": 2
        };

        const value = await coinsController.addCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        stubVerifyToken.restore();
    });

    it("Catch error cantidad de monedas invalido", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo);

        const coinReq = {
            "userName": "JaverBena3",
            "coinName": "Bitcoin",
            "quantity": "-2"
        };

        const value = await coinsController.addCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
    });

    it("catch error saving coins", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo);
        let stubAddCoins = sinon.stub(mongoServices, "addCoins")
            .rejects("Error saving coins");

        const coinReq = {
            "userName": "JaverBena3",
            "coinName": "Bitcoin1",
            "quantity": 2
        };

        const value = await coinsController.addCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        sinon.assert.called(stubAddCoins);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubAddCoins.restore();
    });

    it("Catch error usuario no autorizado", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);

        const coinReq = {
            "userName": "JaverBena33",
            "coinName": "Bitcoin1",
            "quantity": 2
        };

        const value = await coinsController.addCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        stubVerifyToken.restore();
    });

    it("Get Coins each user OK", async () => {

        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo);

        const coinReq = {
            "userName": "JaverBena3"
        };

        const value = await coinsController.getCoinsInfoController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubGetUserCoinsInfo);
        stubGetUserCoinsInfo.restore();
    });

    it("Catch error user not found", async () => {

        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(false);

        const coinReq = {
            "userName": "JaverBena3"
        };

        const value = await coinsController.getCoinsInfoController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubGetUserCoinsInfo);
        stubGetUserCoinsInfo.restore();
    });

    it("Add Favorite Coins OK", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo);
        let stubAddFavoriteCoins = sinon.stub(mongoServices, "addFavoriteCoins")
            .resolves({succes: true});

        const coinReq = {
            "userName": "JaverBena3",
            "coins": [
                {
                    "id": "cardano",
                    "coinName": "Cardano"
                },
                {
                    "id": "binancecoin",
                    "coinName": "Binance Coin"
                }
            ]
        };

        const value = await coinsController.addFavoriteCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        sinon.assert.called(stubAddFavoriteCoins);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubAddFavoriteCoins.restore();
    });

    it("Catch error token no valido adding favorite coins", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(false);

        const coinReq = {
            "userName": "JaverBena3",
            "coins": [
                {
                    "id": "cardano",
                    "coinName": "Cardano"
                },
                {
                    "id": "binancecoin",
                    "coinName": "Binance Coin"
                }
            ]
        };

        const value = await coinsController.addFavoriteCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        stubVerifyToken.restore();
    });

    it("Catch error usuario no autorizado adding favorite coins", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);

        const coinReq = {
            "userName": "JaverBena33",
            "coins": [
                {
                    "id": "cardano",
                    "coinName": "Cardano"
                },
                {
                    "id": "binancecoin",
                    "coinName": "Binance Coin"
                }
            ]
        };

        const value = await coinsController.addFavoriteCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        stubVerifyToken.restore();
    });

    it("catch error superó el limite de monedas", async () => {

        const userCoinsInfo2 = {
            "_id": "61416b0655a00d86d4a8d726",
            "name": "Javer",
            "lastName": "Benavidez",
            "userName": "JaverBena3",
            "currency": "eur",
            "coins": [
                {
                    "coinName": "bit",
                    "quantity": 24
                }
            ],
            "favoriteCoins": [
                {
                    "id": "bitcoin",
                    "coinName": "Bitcoin"
                },
                {
                    "id": "ethereum",
                    "coinName": "Ethereum"
                },
                {
                    "id": "cardano",
                    "coinName": "Cardano"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                },
                {
                    "id": "tether",
                    "coinName": "Tether"
                }
            ],
            "createdAt": "2021-09-15T03:39:50.599Z",
            "updatedAt": "2021-09-16T02:48:12.123Z"
        };

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo2);

        const coinReq = {
            "userName": "JaverBena3",
            "coins": [
                {
                    "id": "binancecoin",
                    "coinName": "Binance Coin"
                }
            ]
        };

        const value = await coinsController.addFavoriteCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
    });

    it("catch Error saving favorite coins", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo);
        let stubAddFavoriteCoins = sinon.stub(mongoServices, "addFavoriteCoins")
            .rejects("Error saving favorite coins");

        const coinReq = {
            "userName": "JaverBena3",
            "coins": [
                {
                    "id": "binancecoin",
                    "coinName": "Binance Coin"
                }
            ]
        };

        const value = await coinsController.addFavoriteCoins(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        sinon.assert.called(stubAddFavoriteCoins);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubAddFavoriteCoins.restore();
    });

    it("Get coins by id OK", async () => {

        const stubGetCoinsService = sinon.stub(coinServices, "getCoinsService")
            .resolves({success:true});

        const coinReq = {
            "id": "cardano"
        };

        const value = await coinsController.getCoinsById(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubGetCoinsService);
        stubGetCoinsService.restore();
    });

    it("catch error getting coins by id", async () => {

        const stubGetCoinsService = sinon.stub(coinServices, "getCoinsService")
            .rejects("Error getting coins by id");

        const coinReq = {
            "id": "cardano"
        };

        const value = await coinsController.getCoinsById(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubGetCoinsService);
        stubGetCoinsService.restore();
    });

    it("catch error general getting coins by id", async () => {

        const coinReq = null;

        const value = await coinsController.getCoinsById(coinReq);
        expect(value).to.not.be.undefined;
    });

    it("Get Top N by userName OK", async () => {

        const coinInfo1 = {
            data: {
                "symbol": "ada",
                "name": "Cardano",
                "image": {
                    "thumb": "https://assets.coingecko.com/coins/images/975/thumb/cardano.png?1547034860",
                    "small": "https://assets.coingecko.com/coins/images/975/small/cardano.png?1547034860",
                    "large": "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860"
                },
                "market_data": {
                    "current_price": {
                        "usd": 2.41,
                        "ars": 237.31,
                        "eur": 2.05
                    }
                },
                "last_updated": "2021-09-16T22:55:25.605Z"
            }
        };

        const coinInfo2 = {
            data: {
                "symbol": "btc",
                "name": "Bitcoin",
                "image": {
                    "small": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
                },
                "market_data": {
                    "current_price": {
                        "usd": 47878,
                        "ars": 4707090,
                        "eur": 40687
                    }
                },
                "last_updated": "2021-09-16T23:26:14.299Z"
            }
        };

        const userCoinsInfo2 = {
            "_id" : "61416b0655a00d86d4a8d726",
            "name" : "Javer",
            "lastName" : "Benavidez",
            "userName" : "JaverBena3",
            "currency" : "eur",
            "coins" : [ 
                {
                    "coinName" : "bit",
                    "quantity" : 24
                }
            ],
            "favoriteCoins" : [
                {
                    "id" : "cardano",
                    "coinName" : "Cardano"
                },
                {
                    "id" : "bitcoin",
                    "coinName" : "Bitcoin"
                }
            ],
            "createdAt" : "2021-09-15T03:39:50.599Z",
            "updatedAt" : "2021-09-16T02:48:12.123Z"
        };

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo2);
        let stubGetCoinsService = sinon.stub(coinServices, "getCoinsService")
            .onCall(0)
            .resolves(coinInfo1);

        stubGetCoinsService
            .onCall(1)
            .resolves(coinInfo2);

        const coinReq = {
            "userName": "JaverBena3",
            "currency": "USD",
            "sort": "2"
        };

        const value = await coinsController.getTopController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);sinon.assert.called(stubGetCoinsService);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubGetCoinsService.restore();
    });

    it("Get Top N by userName OK without currency and sort", async () => {

        const coinInfo1 = {
            data: {
                "symbol": "ada",
                "name": "Cardano",
                "image": {
                    "thumb": "https://assets.coingecko.com/coins/images/975/thumb/cardano.png?1547034860",
                    "small": "https://assets.coingecko.com/coins/images/975/small/cardano.png?1547034860",
                    "large": "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860"
                },
                "market_data": {
                    "current_price": {
                        "usd": 2.41,
                        "ars": 237.31,
                        "eur": 2.05
                    }
                },
                "last_updated": "2021-09-16T22:55:25.605Z"
            }
        };

        const coinInfo2 = {
            data: {
                "symbol": "btc",
                "name": "Bitcoin",
                "image": {
                    "small": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
                },
                "market_data": {
                    "current_price": {
                        "usd": 47878,
                        "ars": 4707090,
                        "eur": 40687
                    }
                },
                "last_updated": "2021-09-16T23:26:14.299Z"
            }
        };

        const userCoinsInfo2 = {
            "_id" : "61416b0655a00d86d4a8d726",
            "name" : "Javer",
            "lastName" : "Benavidez",
            "userName" : "JaverBena3",
            "currency" : "eur",
            "coins" : [ 
                {
                    "coinName" : "bit",
                    "quantity" : 24
                }
            ],
            "favoriteCoins" : [
                {
                    "id" : "cardano",
                    "coinName" : "Cardano"
                },
                {
                    "id" : "bitcoin",
                    "coinName" : "Bitcoin"
                }
            ],
            "createdAt" : "2021-09-15T03:39:50.599Z",
            "updatedAt" : "2021-09-16T02:48:12.123Z"
        };

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo2);
        let stubGetCoinsService = sinon.stub(coinServices, "getCoinsService")
            .onCall(0)
            .resolves(coinInfo1);

        stubGetCoinsService
            .onCall(1)
            .resolves(coinInfo2);

        const coinReq = {
            "userName": "JaverBena3"
        };

        const value = await coinsController.getTopController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);sinon.assert.called(stubGetCoinsService);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubGetCoinsService.restore();
    });

    it("Get Top N by userName OK without currency and sort and complete de coverage", async () => {

        const coinInfo1 = {
            data: {
                "symbol": "ada",
                "name": "Cardano",
                "image": {
                    "large": "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860"
                },
                "market_data": {
                    "current_price": {
                        "usd": 2.41,
                        "ars": 237.31,
                        "eur": 2.05
                    }
                },
                "last_updated": "2021-09-16T22:55:25.605Z"
            }
        };

        const coinInfo2 = {
            data: {
                "symbol": "btc",
                "name": "Bitcoin",
                "image": {
                    "small": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
                },
                "market_data": {
                    "current_price": {
                        "usd": 47878,
                        "ars": 4707090,
                        "eur": 40687
                    }
                },
                "last_updated": "2021-09-16T23:26:14.299Z"
            }
        };

        const userCoinsInfo2 = {
            "_id" : "61416b0655a00d86d4a8d726",
            "name" : "Javer",
            "lastName" : "Benavidez",
            "userName" : "JaverBena3",
            "currency" : "eur",
            "coins" : [ 
                {
                    "coinName" : "bit",
                    "quantity" : 24
                }
            ],
            "favoriteCoins" : [
                {
                    "id" : "cardano",
                    "coinName" : "Cardano"
                },
                {
                    "id" : "bitcoin",
                    "coinName" : "Bitcoin"
                }
            ],
            "createdAt" : "2021-09-15T03:39:50.599Z",
            "updatedAt" : "2021-09-16T02:48:12.123Z"
        };

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo2);
        let stubGetCoinsService = sinon.stub(coinServices, "getCoinsService")
            .onCall(0)
            .resolves(coinInfo1);

        stubGetCoinsService
            .onCall(1)
            .resolves(coinInfo2);

        const coinReq = {
            "userName": "JaverBena3",
            "currency": "ars"
        };

        const value = await coinsController.getTopController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);sinon.assert.called(stubGetCoinsService);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubGetCoinsService.restore();
    });

    it("catch error token invalido getting top N", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(false);

        const value = await coinsController.getTopController({});
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        stubVerifyToken.restore();
    });

    it("catch error usuario no autorizado getting top N", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);

        const coinReq = {
            "userName": "JaverBena32",
            "currency": "ars"
        };

        const value = await coinsController.getTopController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        stubVerifyToken.restore();
    });

    it("catch error before add coins getting top N", async () => {

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);

        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns({favoriteCoins: []});

        const coinReq = {
            "userName": "JaverBena3",
            "currency": "ars"
        };

        const value = await coinsController.getTopController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
    });

    it("catch error coin not found", async () => {

        const userCoinsInfo2 = {
            "_id" : "61416b0655a00d86d4a8d726",
            "name" : "Javer",
            "lastName" : "Benavidez",
            "userName" : "JaverBena3",
            "currency" : "eur",
            "coins" : [ 
                {
                    "coinName" : "bit",
                    "quantity" : 24
                }
            ],
            "favoriteCoins" : [
                {
                    "id" : "bitcoin",
                    "coinName" : "Bitcoin"
                }
            ],
            "createdAt" : "2021-09-15T03:39:50.599Z",
            "updatedAt" : "2021-09-16T02:48:12.123Z"
        };

        let stubVerifyToken = sinon.stub(utils, "verifyToken")
            .returns(userInfo);
        let stubGetUserCoinsInfo = sinon.stub(mongoServices, "getUserCoinsInfo")
            .returns(userCoinsInfo2);
        let stubGetCoinsService = sinon.stub(coinServices, "getCoinsService")
            .rejects("error coin not found");

        const coinReq = {
            "userName": "JaverBena3",
            "currency": "ars"
        };

        const value = await coinsController.getTopController(coinReq);
        expect(value).to.not.be.undefined;
        sinon.assert.called(stubVerifyToken);
        sinon.assert.called(stubGetUserCoinsInfo);
        sinon.assert.called(stubGetCoinsService);
        stubVerifyToken.restore();
        stubGetUserCoinsInfo.restore();
        stubGetCoinsService.restore();
    });
});