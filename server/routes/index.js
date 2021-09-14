"use strict";

const express = require('express'),
    app = express(),
    msg = require('../class/messageGeneral'),
    info = require('../../package.json'),
    validate = require('../lib/validate'),
    error = require('../lib/error'),
    userController = require('../controller/user.controller'),
    { authMiddleware } = require('../middlewares/index'),
    coinsController = require('../controller/coins.controller');

const service = info.name;

//endpoint de prueba
app.get('/', authMiddleware, (req, res) => {
    res.json(`Welcome to ${info.name}`);
});

//consultas GET
app.get(`/${service}/coins/:method`, authMiddleware, async (req, res) => {
    const metodo = req.params.method;
    console.log(`>> Inicia consulta GET al endpoint '/${service}/coins/${metodo}`);
    try {
        const dta = req.query;
        console.log(`Request: ${JSON.stringify(dta)}`);
        switch (metodo) {
            case 'list':
                //Se valida el request de entrada
                validate.getCoinsReq(dta);
                //Se ejecuta el controller
                let result = await coinsController.getCoinsListController(dta);
                res.status(result.status).json(result);
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(`>>> Error general: - ${e}`);
        let msgResponse = new msg.MessageBuilder().build();
        msgResponse = error.errorHandler(e, msgResponse);
        res.status(msgResponse.status).json(msgResponse);
    }
})

//Consultas POST
app.post(`/${service}/:method`, async (req, res) => {
    let result;
    const metodo = req.params.method;
    console.log(`>> Inicia consulta POST al endpoint '/${service}/${metodo}`);
    try {
        const dta = req.body;
        console.log(`Request: ${JSON.stringify(dta)}`);
        switch (metodo) {
            case "createUser":
                //Se valida la data
                validate.userReq(dta);
                //Se ejecuta el controller
                result = await userController.createUser(dta);
                res.status(result.status).json(result);
                break;
            case "login":
                //Se valida la data
                validate.loginReq(dta);
                //Se ejecuta el controller
                result = await userController.login(dta);
                res.status(result.status).json(result);
                break;
            default:
                break;
        }
    } catch (e) {
        result = error.errorHandler(e, {});
        res.status(result.status).json(result);
    }
});

module.exports = app;