"use strict";

const authMiddleware = require('./auth');

const middlewares = {
    //middleware para autenticación
    authMiddleware: authMiddleware.verifyToken
};

module.exports = middlewares;