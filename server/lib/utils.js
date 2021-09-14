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

module.exports = {
    verifyUserName,
    generateToken
};