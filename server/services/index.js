"use strict";

const autenticaService = require('./auth.service'),
    coinService = require('./coins.service');

const services = {
    //Servicios para autenticación
    encryptPassword: autenticaService.encryptPassword,
    comparePass: autenticaService.comparePass,

    //Servicios para obtener info de las monedas
    getCoinsService: coinService.getCoinsService
};

module.exports = services;