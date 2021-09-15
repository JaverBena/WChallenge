"use strict";

const { getCoinsService, addCoinsService, getUserCoinsInfo } = require('../services/index'),
    msg = require('../class/messageGeneral'),
    config = require('../config/general.config'),
    error = require('../lib/error'),
    utils = require('../lib/utils');

/**
 * Función que permite obtener información de las criptomonedas comerciales
 * @param {*} dta request de entrada
 * @returns objeto con la información de la consulta
 */
const getCoinsListController = async (dta) => {
    let msgResponse = new msg.MessageBuilder()
        .setSuccess(true)
        .setStatus(200)
        .setMessage()
        .build();

    try {
        const paramsCoinsMarkets = {
            vs_currency: dta.currency
        };
        //Se consulta la API de CoinGecko para obtener información de las monedas
        await getCoinsService(config.coins.urlCoinsMarkets, paramsCoinsMarkets)
            .then(async r => {
                let coins = r.data;
                //Se obtiene la información solicitada
                let coinsInfo = coins.map((coin) => {
                    return {
                        nombre: coin.name,
                        simbolo: coin.symbol,
                        precio: coin.current_price,
                        imagen: coin.image,
                        fechaUltimaActualizacion: coin.last_updated
                    };
                });
                msgResponse.documents = coinsInfo;
            })
            .catch(e => {
                console.log(`>>> Error haciendo el llamado a: ${config.coins.urlCoinsMarkets} - ${e}`);
                msgResponse = error.errorHandler(e, msgResponse);
            });
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método 'getCoinsListController': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
};

const addCoins = async (dta) => {
    let msgResponse = new msg.MessageBuilder()
        .setSuccess(true)
        .setStatus(200)
        .setMessage()
        .build();

    try {
        //Se obtiene info del usuario por medio del token
        const infoUser = await utils.verifyToken(dta.token);
        if (!infoUser) {
            msgResponse.status = 401;
            throw new Error('El token no es valido');
        }

        //Se valida si el nombre de usuario corresponde al del token
        if (infoUser.userName == dta.userName) {
            //Se obtiene información de las monedas del usuario
            const userCoinsInfo = await getUserCoinsInfo({ userName: dta.userName });
            const validateCoin = userCoinsInfo.coins.filter(coin => coin.coinName == dta.coinName);

            if (validateCoin.length == 1) {
                let temp = parseFloat(dta.quantity) + parseFloat(validateCoin[0].quantity);
                console.log('****', temp);
                if (temp < 0) {
                    throw new Error('La cantidad de monedas que se desea restar supera la cantidad registrada');
                }
            }
            //Se agregan las monedas
            await addCoinsService(dta, validateCoin)
                .then(() => {
                    console.log('>> Monedas agregadas correctamente');
                    msgResponse.message = 'Monedas agregadas correctamente!';
                })
                .catch(e => {
                    console.log(`>>> Error al guardar las monedas - ${e}`);
                    msgResponse = error.errorHandler(e, msgResponse);
                })
        } else {
            //Si el usuario obtenido del token no corresponde al enviado en el request, no es autorizado.
            msgResponse.success = false;
            msgResponse.status = 401;
            msgResponse.message = "Ups! Usuario no autorizado"
        }
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método 'addCoins': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
};

/**
 * Función que permite obtener la información del usuario y las monedas registradas
 * @param {*} dta Objeto con la información del usuario
 * @returns Objeto con la infomación del usuario registrada en bd
 */
const getCoinsInfoController = async (dta) => {
    let msgResponse = new msg.MessageBuilder()
        .setSuccess(true)
        .setStatus(200)
        .setMessage()
        .build();

    try {
        //Se consulta información del usuario
        const userCoinsInfo = await getUserCoinsInfo({ userName: dta.userName });
        if (!userCoinsInfo) throw new Error('Ups! Usuario no encontrado');
        msgResponse.documents = userCoinsInfo;
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método 'addCoins': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
}

module.exports = {
    getCoinsListController,
    addCoins,
    getCoinsInfoController
};