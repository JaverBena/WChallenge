"use strict";

const config = require('../config/general.config'),
    jwt = require('jsonwebtoken'),
    utils = require('../lib/utils');

/**
 * Middleware para verificar el token
 * @param {*} req objeto con la data de entrada
 * @param {*} res response de la función
 * @param {*} next 
 */
const verifyToken = (req, res, next) => {
    try {
        //Se obtiene el token de los headers
        const token = req.headers.token;
        if (!token) res.status(403).json('Ups! Ingresa un token.');

        //Se decodifica el token
        const tokenDecoded = jwt.verify(token, config.SECRET);
        //Se verifica el nombre de usuario de acuerdo al token
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