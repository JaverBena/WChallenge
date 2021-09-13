"use strict";

const utilities = require("./utilities"),
    config = require("../config/general.config");

const isNullOrEmpty = utilities.isNullOrEmpty;

/**
 * Funcion para tratamiento de errores
 * @param {*} e Error generado
 * @returns {} Result
 */
function errorHandler(e) {
    let r = {};
    if (config.logs) console.log("> ErrorHandler ", e.message);
    if (e.name === 'ValidationError')
        r.status = 400;
    else if (e.status)
        r.status = e.status;
    else
        r.status = 500;

    if (!isNullOrEmpty(e.response) && !isNullOrEmpty(e.response.data)) {
        r.status = e.response.status;
        r.message = e.response.data.title;
        r.documents = {
            errors: e.response.data.errors
        };
        if (e.metadata)
            r.documents.metadata = e.metadata;
    } else {
        r.message = e.message || e.stack;
    }
    return r;
}

module.exports = { errorHandler };