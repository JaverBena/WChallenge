"use strict";

const express = require('express'),
    app = express(),
    info = require('../../package.json'),
    validate = require('../lib/validate'),
    error = require('../lib/error'),
    userController = require('../controller/user.controller'),
    { authMiddleware } = require('../middlewares/index');

const service = info.name;

app.get('/', authMiddleware, (req, res) => {
    res.json(`Welcome to ${info.name}`);
});

app.post(`/${service}/:method`, async (req, res) => {
    let result;
    const metodo = req.params.method;
    try {
        const dta = req.body;
        switch (metodo) {
            case "createUser":
                validate.userRequest(dta);
                result = await userController.createUser(dta);
                res.json(result);
                break;
            case "login":
                validate.loginRequest(dta);
                result = await userController.login(dta);
                res.json(result);
                break;
            default:
                break;
        }
    } catch (e) {
        let result = error.errorHandler(e);
        res.status(result.status).json(result);
    }
});

module.exports = app;