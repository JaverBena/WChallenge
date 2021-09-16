"use strict";

const database = require('../config/db.connection'),
    userModel = require('../models/user.model'),
    userCoinsModel = require('../models/user-coins.model');

/**
 * Función que permite crear y almacenar un registro con la información del usuario
 * @param {*} data Objeto con los datos del usuario a crear
 * @returns Response del usuario guardado
 */
const saveUser = async (data) => {
    await database.dbConnect();
    const newUser = await userModel.create(data);
    await database.dbDisconnect();
    return newUser;
};

/**
 * Función que permite crear y almacenar un registro con la información del usuario y monedas
 * @param {*} data Objeto con los datos del usuario y monedas a crear
 * @returns Objeto del usuario guardado
 */
const addUserCoins = async (data) => {
    let userCoins = {
        name: data.name,
        lastName: data.lastName,
        userName: data.userName,
        currency: data.currency,
        coins: []
    }
    await database.dbConnect();
    const newUserCoins = await userCoinsModel.create(userCoins);
    await database.dbDisconnect();
    return newUserCoins;
};

/**
 * Función que permite obtener un registro de bd con la información del usuario
 * @param {*} data Objeto con el filtro para obtener la información del usuario
 * @returns Objeto con la información del usuario
 */
const getUserCoinsInfo = async (data) => {
    await database.dbConnect();
    const userCoinInfo = await userCoinsModel.findOne(data);
    await database.dbDisconnect();
    return userCoinInfo;
};

/**
 * Función que permite agregar monedas al usuario
 * @param {*} dta Objecto con información del usuario
 * @param {*} validateCoin Array/Objeto con la información de las monedas registradas
 * @returns Response de la transacción
 */
const addCoins = async (dta, validateCoin) => {
    const filter = { userName: dta.userName };
    let seteo, arrayFilter = null;

    if (validateCoin.length == 1) {
        seteo = {
            $set: {
                'coins.$[coin]': {
                    coinName: dta.coinName,
                    quantity: parseFloat(validateCoin[0].quantity) + parseFloat(dta.quantity)
                }
            }
        };

        arrayFilter = {
            'arrayFilters': [
                {
                    "coin.coinName": {
                        $eq: dta.coinName
                    }
                }
            ]
        };
    } else {
        seteo = {
            $push: {
                coins: {
                    coinName: dta.coinName,
                    quantity: parseFloat(dta.quantity)
                }
            }
        }
    }
    await database.dbConnect();
    const userCoinInfoUpdated = await userCoinsModel.updateOne(filter, seteo, arrayFilter);
    await database.dbDisconnect();
    return userCoinInfoUpdated;
};

/**
 * Función que permite actualizar el arreglo de las monedas favoritas
 * @param {*} dta Objeto con la información a almacenar
 * @returns Response de la transacción
 */
const addFavoriteCoins = async (dta) => {
    const filter = { userName: dta.userName };
    let seteo = {
        $push: {
            favoriteCoins: {
                coinName: dta.coinName
            }
        }
    }
    await database.dbConnect();
    const userCoinInfoUpdated = await userCoinsModel.updateOne(filter, seteo);
    await database.dbDisconnect();
    return userCoinInfoUpdated;
};

module.exports = {
    saveUser,
    addUserCoins,
    getUserCoinsInfo,
    addCoins,
    addFavoriteCoins
};