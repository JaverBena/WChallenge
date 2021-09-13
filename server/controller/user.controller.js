"use strict";

const userModel = require('../models/user.model'),
    config = require('../config/general.config'),
    utilities = require('../lib/utilities'),
    { verifyUserName, generateToken } = require('../lib/utils');

/**
 * Función que permite registrar un usuario y de generarle el token.
 * @param {*} user Objeto con la información del usuario a registrar
 * @returns Response
 */
const createUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        let userCloned = utilities.cloneObject(user);

        const userFound = await verifyUserName(user.userName);
        if (userFound) reject({
            status: 400,
            message: "Ups! El nombre de usuario que ingresaste ya existe. Por favor ingresa uno diferente."
        });

        userCloned.password = await userModel.encryptPassword(user.password);

        const newUser = new userModel(userCloned);
        await newUser.save((err) => {
            if (err) reject(err);
        });

        const token = generateToken(newUser.userName);
        const response = {
            message: "Usuario creado con éxito",
            documents: {
                token,
                expireAt: utilities.addSeconds(new Date(), config.timeToken)
            }
        };
        resolve(response);
    });
};

/**
 * Función que permite obtener el token para realizar consultas.
 * @param {*} user Objeto con los datos del usuario para login
 * @returns Response con el token
 */
const login = async (user) => {
    return new Promise(async(resolve, reject) => {
        const userFound = await verifyUserName(user.userName);
        if (!userFound) reject({
            status: 400,
            message: "Ups! El nombre de usuario que ingresaste no existe. Por favor ingresa uno diferente."
        });

        const matchPassword = await userModel.comparePass(user.password, userFound.password);
        if (!matchPassword) reject({
            status: 401,
            message: "Ups! Contraseña invalida"
        });

        const token = generateToken(userFound.userName);
        const response = {
            message: "Inicio de sesión exitoso!",
            documents: {
                token,
                expireAt: utilities.addSeconds(new Date(), config.timeToken)
            }
        };
        resolve(response);
    });
};

module.exports = {
    createUser,
    login
};