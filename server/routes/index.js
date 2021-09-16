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

//consultas GET relacionadas con las monedas y usuarios
app.get(`/${service}/coins/:method`, authMiddleware, async (req, res) => {
    let result;
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
                result = await coinsController.getCoinsListController(dta);
                res.status(result.status).json(result);
                break;
            case 'info':
                //Se valida el request de entrada
                validate.getCoinsInfoReq(dta);
                //Se ejecuta el controller
                result = await coinsController.getCoinsInfoController(dta);
                res.status(result.status).json(result);
                break;
            case 'top':
                dta.token = req.headers.token;
                //Se valida el request de entrada
                validate.getTopReq(dta);
                //Se ejecuta el controller
                result = await coinsController.getTopController(dta);
                res.status(result.status).json(result);
                break;
            case 'id':
                //Se valida el request de entrada
                validate.getCoinByIdReq(dta);
                //Se ejecuta el controller
                result = await coinsController.getCoinsById(dta);
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
});

//Consultas POST relacionadas con users
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
        console.log(`>>> Error general: - ${e}`);
        result = error.errorHandler(e, {});
        res.status(result.status).json(result);
    }
});

//Consultas POST para agregar monedas a los usuarios
app.post(`/${service}/coins/:method`, authMiddleware, async (req, res) => {
    let result;
    const metodo = req.params.method;
    console.log(`>> Inicia consulta POST al endpoint '/${service}/${metodo}`);
    try {
        let dta = req.body;
        dta.token = req.headers.token;
        console.log(`Request: ${JSON.stringify(dta)}`);
        switch (metodo) {
            case "add":
                //Se valida la data
                validate.addCoinsReq(dta);
                //Se ejecuta el controller
                result = await coinsController.addCoins(dta);
                res.status(result.status).json(result);
                break;
            case "favorite":
                //Se valida la data
                validate.addFavoriteCoinsReq(dta);
                // //Se ejecuta el controller
                result = await coinsController.addFavoriteCoins(dta);
                res.status(result.status).json(result);
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(`>>> Error general: - ${e}`);
        result = error.errorHandler(e, {});
        res.status(result.status).json(result);
    }
});

module.exports = app;