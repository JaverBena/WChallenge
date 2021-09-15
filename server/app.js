"use strict";

const express = require('express'),
    // database = require('./config/db.connection'),
    app = express(),
    cors = require('cors'),
    config = require('./config/general.config'),
    info = require('../package.json'),
    swaggerUi = require('swagger-ui-express'),
    openApiDocumentation = require('./document/api-documentation.json');

// database.dbConnect();

app
    .use(express.urlencoded({ extended: false }))
    .use(express.json())
    .use(cors())
    .use(require("./routes/index"))
    .use(`/api/documentation`, swaggerUi.serve, swaggerUi.setup(openApiDocumentation))
    .listen(config.port, () => {
        console.log(`${info.name} listening on port ${config.port}`);
    });