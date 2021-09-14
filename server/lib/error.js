"use strict";

const utilities = require("./utilities");

const isNullOrEmpty = utilities.isNullOrEmpty;

/**
 * Funcion para tratamiento de errores
 * @param {*} e Error generado
 * @returns {} Result
 */
function errorHandler(e, msg) {

    if (e.name === 'ValidationError')
        msg.status = 400;
    else if (e.status)
        msg.status = e.status;
    else
        msg.status = 500;

    if (!isNullOrEmpty(e.response) && !isNullOrEmpty(e.response.data)) {
        msg.status = e.response.status;
        msg.message = "Failed transaction";
        msg.documents = {
            errors: e.response.data.errors || e.response.data.error
        };
        if (e.metadata)
            msg.documents.metadata = e.metadata;
    } else {
        msg.message = e.message || e.stack || "Failed transaction";
    }
    msg.success = false;
    return msg;
}

module.exports = { errorHandler };