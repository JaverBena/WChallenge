"use strict";

const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: String,
    lastName: String,
    userName: {
        type: String,
        unique: true
    },
    password: String,
    currency: String
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', User, 'coll_user');