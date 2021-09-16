"use strict";

const yup = require("yup");

const RegExp = {
    string: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\-\.\s]+$/,
    currency: /^(EUR|eur|USD|usd|ARS|ars)$/,
    sort: /^(1|2)$/
};

function userReq(data) {

    const schema = yup.object().shape({
        name: yup
            .string()
            .required()
            .min(1)
            .max(25)
            .matches(RegExp.string, {
                message: `name [${data.name}] does not contain the valid format`
            }),
        lastName: yup
            .string()
            .required()
            .min(1)
            .max(25)
            .matches(RegExp.string, {
                message: `lastName [${data.lastName}] does not contain the valid format`
            }),
        userName: yup
            .string()
            .required()
            .min(1)
            .max(15)
            .matches(RegExp.string, {
                message: `userName [${data.userName}] does not contain the valid format`
            }),
        password: yup
            .string()
            .required()
            .min(8)
            .matches(RegExp.string, {
                message: `password [${data.password}] does not contain the valid format`
            }),
        currency: yup
            .string()
            .required()
            .matches(RegExp.currency, {
                message: `currency [${data.currency}] does not contain the valid format`
            }),
    });

    schema.validateSync(data);
}

function loginReq(data) {

    const schema = yup.object().shape({
        userName: yup
            .string()
            .required()
            .min(1)
            .max(15)
            .matches(RegExp.string, {
                message: `userName [${data.userName}] does not contain the valid format`
            }),
        password: yup
            .string()
            .required()
            .min(8)
            .matches(RegExp.string, {
                message: `password [${data.password}] does not contain the valid format`
            })
    });

    schema.validateSync(data);
}

function getCoinsReq(data) {

    const schema = yup.object().shape({
        currency: yup
            .string()
            .required()
            .matches(RegExp.currency, {
                message: `currency [${data.currency}] does not contain the valid format. You must specify a number`
            }),
    });

    schema.validateSync(data);
}

function addCoinsReq(data) {

    const schema = yup.object().shape({
        userName: yup
            .string()
            .required()
            .min(1)
            .max(15)
            .matches(RegExp.string, {
                message: `userName [${data.userName}] does not contain the valid format. You must specify a string`
            }),
        coinName: yup
            .string()
            .required()
            .min(1)
            .matches(RegExp.string, {
                message: `coinName [${data.coinName}] does not contain the valid format. You must specify a name of a coin`
            }),
        quantity: yup
            .number()
            .required()
            .typeError(`quantity [${data.quatity}] does not contain the valid format. You must specify a number`)
    });

    schema.validateSync(data);
}

function getCoinsInfoReq(data) {

    const schema = yup.object().shape({
        userName: yup
            .string()
            .required()
            .min(1)
            .max(15)
            .matches(RegExp.string, {
                message: `userName [${data.userName}] does not contain the valid format. You must specify a string`
            }),
    });

    schema.validateSync(data);
}

function addFavoriteCoinsReq(data) {

    const schema = yup.object().shape({
        userName: yup
            .string()
            .required()
            .min(1)
            .max(15)
            .matches(RegExp.string, {
                message: `userName [${data.userName}] does not contain the valid format. You must specify a string`
            }),
        coins: yup.array().min(1).of(yup.object().shape({
            coinName: yup
            .string()
            .required()
            .min(1)
            .matches(RegExp.string, {
                message: `coinName [${data.coinName}] does not contain the valid format. You must specify a name of a coin`
            }),
        }))
    });

    schema.validateSync(data);
}

function getTopReq(data) {

    const schema = yup.object().shape({
        userName: yup
            .string()
            .required()
            .min(1)
            .max(15)
            .matches(RegExp.string, {
                message: `userName [${data.userName}] does not contain the valid format. You must specify a string`
            }),
        currency: yup
            .string()
            .matches(RegExp.currency, {
                message: `currency [${data.currency}] does not contain the valid format. You must specify a number`
            }),
        sort: yup
            .string()
            .matches(RegExp.sort, {
                message: `sort [${data.sort}] does not contain the valid format. You must specify a number (1 o 2)`
            }),
    });

    schema.validateSync(data);
}

function getCoinByIdReq(data) {

    const schema = yup.object().shape({
        id: yup
            .string()
            .required()
            .min(1)
            .matches(RegExp.string, {
                message: `id [${data.id}] does not contain the valid format. You must specify a string`
            }),
    });

    schema.validateSync(data);
}

module.exports = {
    userReq,
    loginReq,
    getCoinsReq,
    addCoinsReq,
    getCoinsInfoReq,
    addFavoriteCoinsReq,
    getTopReq,
    getCoinByIdReq
};