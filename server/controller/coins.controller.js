"use strict";

const { getCoinsService } = require('../services/index'),
    msg = require('../class/messageGeneral'),
    config = require('../config/general.config'),
    error = require('../lib/error');

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
    } catch (e) {
        console.log(`>>> Error en el método 'getCoinsListController': - ${e}`);
        msgResponse = error.errorHandler(e, msgResponse);
    } finally {
        return msgResponse;
    }
};

module.exports = {
    getCoinsListController
};