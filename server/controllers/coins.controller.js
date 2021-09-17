"use strict";

const coinServices = require('../services/coins.service'),
    mongoServices = require('../services/mongo.service'),
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
        await coinServices.getCoinsService(config.coins.urlCoinsMarkets, paramsCoinsMarkets)
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
            const userCoinsInfo = await mongoServices.getUserCoinsInfo({ userName: dta.userName });
            const validateCoin = userCoinsInfo.coins.filter(coin => coin.coinName == dta.coinName);

            if (validateCoin.length == 1) {
                let temp = parseFloat(dta.quantity) + parseFloat(validateCoin[0].quantity);
                if (temp < 0) {
                    throw new Error('La cantidad de monedas que se desea restar supera la cantidad registrada');
                }
            }
            //Se agregan las monedas
            await mongoServices.addCoins(dta, validateCoin)
                .then(() => {
                    console.log('>> Monedas agregadas correctamente');
                    msgResponse.message = 'Monedas agregadas correctamente!';
                })
                .catch(e => {
                    console.log(`>>> Error al guardar las monedas - ${e}`);
                    msgResponse = error.errorHandler(e, msgResponse);
                });
        } else {
            //Si el usuario obtenido del token no corresponde al enviado en el request, no es autorizado.
            msgResponse.success = false;
            msgResponse.status = 401;
            msgResponse.message = "Ups! Usuario no autorizado";
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
        const userCoinsInfo = await mongoServices.getUserCoinsInfo({ userName: dta.userName });
        if (!userCoinsInfo) throw new Error('Ups! Usuario no encontrado');
        msgResponse.documents = userCoinsInfo;
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método 'getCoinsInfoController': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
};

/**
 * Función que permite agregar monedas favoritas al usuario
 * @param {*} dta Objeto con la información de las monedas favoritas
 * @returns Response de transacción
 */
const addFavoriteCoins = async(dta) => {
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
            const userCoinsInfo = await mongoServices.getUserCoinsInfo({ userName: dta.userName });

            if (userCoinsInfo.favoriteCoins.length >= 25) throw new Error('Has superado el límite para agregar monedas');
            //Se recorre el arreglo de las monedas favoritas
            for (const favoriteCoin of dta.coins) {
                const validateCoin = userCoinsInfo.favoriteCoins.filter(coin => coin.coinName == favoriteCoin.coinName);
                if (validateCoin.length == 0) {
                    // Se agregan las monedas favoritas
                    await mongoServices.addFavoriteCoins({ userName: dta.userName, ...favoriteCoin })
                        .then(() => {
                            console.log('>> Monedas favoritas agregadas correctamente');
                            msgResponse.message = 'Monedas favoritas agregadas correctamente!';
                        })
                        .catch(e => {
                            console.log(`>>> Error al guardar las monedas favoritas - ${e}`);
                            msgResponse = error.errorHandler(e, msgResponse);
                        });
                }
            }
        } else {
            //Si el usuario obtenido del token no corresponde al enviado en el request, no es autorizado.
            msgResponse.success = false;
            msgResponse.status = 401;
            msgResponse.message = "Ups! Usuario no autorizado";
        }
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método 'addFavoriteCoins': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
};

/**
 * Función que permite obtener toda la información de una sola moneda
 * @param {*} dta id de la moneda a consultar
 * @returns Objeto con la información de la moneda
 */
const getCoinsById = async (dta) => {
    let msgResponse = new msg.MessageBuilder()
        .setSuccess(true)
        .setStatus(200)
        .setMessage()
        .build();

    try {
        const paramsCoinsMarkets = {
            tickers: false,
            community_data: false,
            developer_data: false,
            sparkline: false
        };
        const uri = config.coins.urlCoinsInfo + dta.id;
        //Se consulta la API de CoinGecko para obtener información de la moneda por ID
        await coinServices.getCoinsService(uri, paramsCoinsMarkets)
            .then(async r => {
                let coin = r.data;
                msgResponse.documents = coin;
            })
            .catch(e => {
                console.log(`>>> Error haciendo el llamado a: ${uri} - ${e}`);
                msgResponse = error.errorHandler(e, msgResponse);
            });
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método 'getCoinsById': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
};

/**
 * Función que permite obtener el TOP N de las monedas favoritas del usuario
 * @param {*} dta Objeto con la información de del usuario
 * @returns Top N de las monedas del usuario
 */
const getTopController = async(dta) => {
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
            const userCoinsInfo = await mongoServices.getUserCoinsInfo({ userName: dta.userName });

            if (userCoinsInfo.favoriteCoins.length == 0) throw new Error('Agrega monedas favoritas para comparar');

            let arrayCoins = [];
            for (const favoriteCoin of userCoinsInfo.favoriteCoins) {

                let coinInfo = await getCoinsById({ id: favoriteCoin.id });
                if (!coinInfo.success) throw new Error(`No se encontró información de la moneda con id ${favoriteCoin.id}`);

                let temp = {
                    name: coinInfo.documents.name,
                    symbol: coinInfo.documents.symbol,
                    image: coinInfo.documents.image.thumb ? coinInfo.documents.image.thumb : coinInfo.documents.image.small ? coinInfo.documents.image.small : coinInfo.documents.image.large,
                    priceUSD: coinInfo.documents.market_data.current_price.usd,
                    priceEUR: coinInfo.documents.market_data.current_price.eur,
                    priceARS: coinInfo.documents.market_data.current_price.ars,
                    lastUpdated: coinInfo.documents.last_updated
                };

                arrayCoins.push(temp);
            }

            console.log('Arreglo desorganizado --> ', arrayCoins);
            const currency = dta.currency ? dta.currency : userCoinsInfo.currency;
            const orden = dta.sort ? dta.sort : 1;
            utils.sortArray(arrayCoins, currency, orden);
            console.log('Arreglo organizado --> ', arrayCoins);

            msgResponse.documents = arrayCoins;
        } else {
            //Si el usuario obtenido del token no corresponde al enviado en el request, no es autorizado.
            msgResponse.success = false;
            msgResponse.status = 401;
            msgResponse.message = "Ups! Usuario no autorizado";
        }
        return msgResponse;
    } catch (e) {
        console.log(`>>> Error en el método 'getTopController': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
        return msgResponse;
    }
};

module.exports = {
    getCoinsListController,
    addCoins,
    getCoinsInfoController,
    addFavoriteCoins,
    getTopController,
    getCoinsById
};