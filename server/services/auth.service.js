"use strict";

const bcrypt = require('bcrypt');

/**
 * Función que permite encriptar contraseñas
 * @param {*} pass Contraseña a encriptar
 * @returns Contraseña encriptada
 */
const encryptPassword = async (pass) => {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(pass, salt);
};

/**
 * Función que permite verificar si dos contraseñas son iguales.
 * @param {*} pass Constraseña a comparar
 * @param {*} passEncrypted Constraseña encriptada a comparar
 * @returns Boolean indicando si las constraseñas son iguales
 */
const comparePass = async (pass, passEncrypted) => {
    return await bcrypt.compare(pass, passEncrypted);
};

module.exports = {
    encryptPassword,
    comparePass
};