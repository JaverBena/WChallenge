"use strict"

const mongoose = require('mongoose'),
    config = require('./general.config');

const dbConnect = async () => {
    await mongoose.connect(config.urlDb)
        .then(db => { console.log('Database is connected') })
        .catch(e => { console.log('Database is NOT connected') })
};

module.exports = {
    dbConnect
};