"use strict"

const express = require('express'),
    database = require('./config/db.connection'),
    app = express(),
    cors = require('cors'),
    config = require('./config/general.config'),
    info = require('../package.json');

database.dbConnect();

app
    .use(express.urlencoded({ extended: false }))
    .use(express.json())
    .use(cors())
    .use(require("./routes/index"))
    .listen(config.port, () => {
        console.log(`${info.name} listening on port ${config.port}`);
    });