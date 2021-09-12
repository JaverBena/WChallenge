const userModel = require('../models/user.model'),
    jwt = require('jsonwebtoken'),
    config = require('../config/general.config'),
    utils = require('../lib/utilities');

const verifyUserName = async (userName) => {
    const userFound = await userModel.findOne({userName});
    return userFound? true : false;
};

const createUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        let userCloned = utils.cloneObject(user);

        const userFound = await verifyUserName(user.userName);
        if (userFound) reject({
            status: 400,
            message: "Ups! El 'userName' que ingresaste ya existe. Por favor ingresa uno diferente."
        });

        userCloned.password = await userModel.encryptPassword(user.password);

        const newUser = new userModel(user);
        await newUser.save((err, resultDB) => {
            if (err) reject(err)
        });

        const token = jwt.sign({id: newUser._id}, config.SECRET, { expiresIn: config.timeToken });
        const response = {
            message: "Usuario creado con éxito",
            documents: {
                token,
                expireAt: utils.addSeconds(new Date(), config.timeToken)
            }
        }
        resolve(response);

    });
};

module.exports = {
    createUser
}