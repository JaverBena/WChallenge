"use strict";

const autenticaService = require('./auth.service'),
    coinService = require('./coins.service'),
    mongoService = require('./mongo.service');

const services = {
    //Servicios para autenticación
    encryptPassword: autenticaService.encryptPassword,
    comparePass: autenticaService.comparePass,

    //Servicios para obtener info de las monedas
    getCoinsService: coinService.getCoinsService,

    //Servicios mongo
    saveUser: mongoService.saveUser,
    addUserCoins: mongoService.addUserCoins,
    getUserCoinsInfo: mongoService.getUserCoinsInfo,
    addCoinsService: mongoService.addCoins,
};

module.exports = services;