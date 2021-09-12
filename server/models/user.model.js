"use strict"

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

User.statics.encryptPassword = async (pass) => {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(pass, salt);
}

User.statics.comparePass = async (pass, recievedPass) => {
    return await bcrypt.compare(pass, recievedPass);
}

module.exports = mongoose.model('User', User, 'coll_user');