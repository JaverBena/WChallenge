"use strict";

const config = require('../config/general.config'),
    jwt = require('jsonwebtoken'),
    utils = require('../lib/utils');

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) res.status(403).json('Ups! Ingresa un token.');
    
        const tokenDecoded = jwt.verify(token, config.SECRET);
        const userFound = utils.verifyUserName(tokenDecoded.userName);
        if (!userFound) res.status(404).json({
            status: 404,
            message: "Ups! Nombre de usuario no encontrado"
        });
        next();
    } catch (e) {
        res.status(401).json({
            status: 401,
            message: "Ups! Usuario no autorizado"
        });
    }
};

module.exports = {
    verifyToken
};