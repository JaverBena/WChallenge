"use strict";

const mongoose = require('mongoose'),
    config = require('./general.config');

/**
 * Función que permite conectar a la base de datos
 */
const dbConnect = async () => {
    await mongoose.connect(config.urlDb)
        // .then(() => console.log('Database is connected'))
        .catch(() => console.log('Database is NOT connected'));
};

/**
 * Función que permite desconectar la sesión de la base de datos
 */
const dbDisconnect = async () => {
    await mongoose.disconnect()
        // .then(() => console.log('Database is disconnected'))
        .catch(() => console.log('Database is NOT disconnected'));
};

module.exports = {
    dbConnect,
    dbDisconnect
};