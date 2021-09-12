"use strict";

const yup = require("yup");

const RegExp = {
    string: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\-\.\s]+$/,
    currency: /^(EUR|USD|ARP)$/,
};

function userRequest(data) {

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
    })

    schema.validateSync(data);
};

module.exports = {
    userRequest
};