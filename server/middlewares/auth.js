"use strict";

const utils = require('../lib/utils');

/**
 * Middleware para verificar el token
 * @param {*} req objeto con la data de entrada
 * @param {*} res response de la función
 * @param {*} next 
 */
const verifyToken = async (req, res, next) => {
    try {
        //Se obtiene el token de los headers
        const token = req.headers.token;
        if (!token) res.status(403).json('Ups! Ingresa un token.');

        //Se verifica si existe un usuraio con el token ingresado
        const userFound = await utils.verifyToken(token);

        if (!userFound) res.status(404).json({
            status: 404,
            message: "Ups! Nombre de usuario no encontrado"
        });
        
        next();
    } catch (e) {
        console.log('>>>>', e);
        res.status(401).json({
            status: 401,
            message: e.message? e.message : "Ups! Usuario no autorizado"
        });
    }
};

module.exports = {
    verifyToken
};