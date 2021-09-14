"use strict";

const axios = require('axios');

/**
 * Función que permite realizar consultas GET a la API de CoinGecko
 * @param {*} urlCoins URL para realizar la consulta GET
 * @param {*} params Objeto con parametros
 * @returns Objeto o array con la respuesta de acuerdo a la consulta
 */
const getCoinsService = async (urlCoins, params) => {
    return await axios.get(urlCoins, { params: params? params : {}}, { timeout: 10000 });
};

module.exports = {
    getCoinsService
}