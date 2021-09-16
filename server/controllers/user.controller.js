"use strict";

const msg = require('../class/messageGeneral'),
    config = require('../config/general.config'),
    utilities = require('../lib/utilities'),
    error = require('../lib/error'),
    { verifyUserName, generateToken } = require('../lib/utils'),
    { encryptPassword, comparePass, saveUser, addUserCoins } = require('../services/index');

/**
 * Función que permite registrar un usuario y de generarle el token.
 * @param {*} user Objeto con la información del usuario a registrar
 * @returns Response
 */
const createUser = async (user) => {
    let msgResponse = new msg.MessageBuilder()
        .setSuccess(false)
        .setStatus(500)
        .setMessage()
        .build();

    try {
        let userCloned = utilities.cloneObject(user);
        //Se verifica si existe el nombre de usuario
        await verifyUserName(user.userName)
            .then(async userFound => {
                if (userFound) {
                    msgResponse.status = 400;
                    msgResponse.message = "Ups! El nombre de usuario que ingresaste ya existe. Por favor ingresa uno diferente.";
                    return msgResponse;
                }

                //Se encripta la contraseña ingresada
                await encryptPassword(user.password)
                    .then(async pass => {
                        userCloned.password = pass;

                        await saveUser(userCloned);
                        await addUserCoins(userCloned);

                        //Se genera el token
                        const token = generateToken(user.userName);
                        msgResponse.success = true;
                        msgResponse.status = 200;
                        msgResponse.message = "Usuario creado con éxito";
                        msgResponse.documents = {
                            token,
                            expireAt: utilities.addSeconds(new Date(), config.timeToken)
                        };
                        console.log('>> Usuario creado con éxito');
                    })
                    .catch(e => {
                        console.log(`>>> Error encriptando la constraseña: - ${e}`);
                        msgResponse = error.errorHandler(e, msgResponse);
                    });
            })
            .catch(e => {
                console.log(`>>> Error verificando el nombre de usuario: - ${e}`);
                msgResponse = error.errorHandler(e, msgResponse);
            });
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método de 'createUser': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
};

/**
 * Función que permite obtener el token para realizar consultas.
 * @param {*} user Objeto con los datos del usuario para login
 * @returns Response con el token
 */
const login = async (user) => {
    let msgResponse = new msg.MessageBuilder()
        .setSuccess(false)
        .setStatus(500)
        .setMessage()
        .build();

    try {
        //Se verifica si existe el usuario
        await verifyUserName(user.userName)
            .then(async r => {
                const userFound = r;
                if (!userFound) {
                    msgResponse.status = 400;
                    msgResponse.message = "Ups! El nombre de usuario que ingresaste no existe. Por favor ingresa uno diferente.";
                    return msgResponse;
                }

                //Se compara las constraseñas
                await comparePass(user.password, userFound.password)
                    .then(async r => {
                        const matchPassword = r;
                        if (!matchPassword) {
                            msgResponse.status = 401;
                            msgResponse.message = "Ups! Contraseña invalida";
                            return msgResponse;
                        }

                        //Se genera el token
                        const token = generateToken(userFound.userName);
                        msgResponse.success = true;
                        msgResponse.status = 200;
                        msgResponse.message = "Inicio de sesión exitoso!";
                        msgResponse.documents = {
                            token,
                            expireAt: utilities.addSeconds(new Date(), config.timeToken)
                        };
                        console.log('>> Inicio de sesión exitoso!');
                    })
                    .catch(e => {
                        console.log(`>>> Error comparando contraseñas: - ${e}`);
                        msgResponse = error.errorHandler(e, msgResponse);
                    });
            })
            .catch(e => {
                console.log(`>>> Error verificando el nombre de usuario: - ${e}`);
                msgResponse = error.errorHandler(e, msgResponse);
            });
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método de 'login': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
};

module.exports = {
    createUser,
    login
};