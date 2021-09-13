"use strict";

module.exports = {
    port: process.env.PORT || 3000,
    urlDb: process.env.URLDB || "mongodb://localhost/wchallenge",
    SECRET: process.env.SECRET || "wchallenge",
    timeToken: process.env.TIMETOKEN || 900,
};