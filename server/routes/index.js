"use strict"

const express = require('express'),
    app = express(),
    info = require('../../package.json'),
    validate = require('../lib/validate'),
    error = require('../lib/error'),
    createUserController = require('../controller/user.controller');

const service = info.name;

app.get('/', (req, res) => {
    res.json(`Welcome to ${info.name}`);
});

app.post(`/${service}/:method`, async (req, res) => {
    const metodo = req.params.method;
    try {
        const dta = req.body;

        switch (metodo) {
            case "createUser":
                validate.userRequest(dta);
                const result = await createUserController.createUser(dta);
                res.json(result)
                break;
            default:
                break;
        }

    } catch (e) {
        let result = error.errorHandler(e);
        res.status(result.status).json(result);
    }
})

module.exports = app;