"use strict";

const userModel = require('../models/user.model'),
    jwt = require('jsonwebtoken'),
    database = require('../config/db.connection'),
    config = require('../config/general.config');

/**
 * Función que permite validar si el nombre de usuario existe.
 * @param {*} userName propiedad del nombre de usuario
 * @returns boolean indicando si existe o no el usuario
 */
 const verifyUserName = async (userName) => {
    await database.dbConnect();
    const userFound = await userModel.findOne({userName});
    await database.dbDisconnect();
    return userFound? userFound : false;
};

/**
 * Función que permite generar un token para que el usuario pueda hacer consultas.
 * @param {*} userName Nombre de usuario
 * @returns Token para realizar consultas
 */
const generateToken = (userName) => {
    return jwt.sign({ userName }, config.SECRET, { expiresIn: config.timeToken });
};

/**
 * Función que permite decodificar el token y verificar si existe un usuario
 * @param {*} token Token ingresado en los headers
 * @returns objeto con la información del usuario de acuerdo al token
 */
const verifyToken = async (token) => {
    //Se decodifica el token
    const tokenDecoded = jwt.verify(token, config.SECRET);
    //Se verifica el nombre de usuario de acuerdo al token
    return await verifyUserName(tokenDecoded.userName);
};

/**
 * Función que permite ordenar el arreglo de monedas
 * @param {*} arrayCoins Arreglo con las monedas a ordenar
 * @param {*} currency Tipo de moneda
 * @param {*} orden Indica el orden (ascendente/descendente)
 */
const sortArray = (arrayCoins, currency, orden) => {
    const ordenArray = (orden == 1) ? [1, -1] : [-1, 1];    // 1 = descendente, 2 = ascendente
    currency = currency.toUpperCase();
    switch (currency) {
        case "USD":
            arrayCoins.sort(function (a, b) {
                if (a.priceUSD > b.priceUSD) {
                    return ordenArray[0];
                }
                if (a.priceUSD < b.priceUSD) {
                    return ordenArray[0];
                }
                // a must be equal to b
                return 0;
            });
            break;
        case "EUR":
            arrayCoins.sort(function (a, b) {
                if (a.priceEUR > b.priceEUR) {
                    return ordenArray[0];
                }
                if (a.priceEUR < b.priceEUR) {
                    return ordenArray[0];
                }
                // a must be equal to b
                return 0;
            });
            break;
        case "ARS":
            arrayCoins.sort(function (a, b) {
                if (a.priceARS > b.priceARS) {
                    return ordenArray[0];
                }
                if (a.priceARS < b.priceARS) {
                    return ordenArray[0];
                }
                // a must be equal to b
                return 0;
            });
            break;
        default:
            break;
    }
};

module.exports = {
    verifyUserName,
    generateToken,
    verifyToken,
    sortArray
};