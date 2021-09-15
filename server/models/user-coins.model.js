"use strict";

const mongoose = require('mongoose');

const coinsArray = new mongoose.Schema({
    coinName: String,
    quantity: {
        type: Number,
        default: 0
    }
}, { _id: false });

const userCoins = new mongoose.Schema({
    name: String,
    lastName: String,
    userName: {
        type: String,
        unique: true
    },
    currency: String,
    coins: [coinsArray]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User_Coins', userCoins, 'coll_user_coins');