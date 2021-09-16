"use strict";

let urlCoinsGeneral = "https://api.coingecko.com/api/v3/coins";

module.exports = {
    port: process.env.PORT || 3000,
    urlDb: process.env.URL_DB || "mongodb://localhost/wchallenge",
    SECRET: process.env.SECRET || "wchallenge",
    timeToken: process.env.TIME_TOKEN || 3600,
    coins: {
        urlCoinsInfo: process.env.URL_COINS_LIST || `${urlCoinsGeneral}/`,
        urlCoinsList: process.env.URL_COINS_LIST || `${urlCoinsGeneral}/list`,
        urlCoinsMarkets: process.env.URL_COINS_LIST || `${urlCoinsGeneral}/markets`
    }
};