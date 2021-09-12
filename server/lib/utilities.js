"use strict";

/**
 * Función para validar si "value" es null
 * @param {*} value 
 * @return true o false
 */
const isNull = function (value) {
    return ((value === null && typeof value === "object") ||
        (value === "null" && typeof value === "string")) ?
        true : false;
}

/**
 * Función para validar si "value" es undefined
 * @param {*} value 
 * @return true o false
 */
const isUndefined = function (value) {
    return ((value === undefined && typeof value === "undefined") ||
        (value === "undefined" && typeof value === "string")) ?
        true : false;
}

/**
 * Función para validar si "value" es empty
 * @param {*} value 
 * @return true o false
 */
const isEmpty = function (value) {
    return (isUndefined(value) ||
        (value === "" && typeof value === "string")) ?
        true : false;
}

/**
 * Función para validar si "value" es null, undefined o vacío
 * La validación toma en cuenta si el null y el undefined 
 * son object o string.
 * @param {*} value valor de entrada
 * @return true o false
 */
const isNullOrEmpty = function (value) {
    return (isNull(value) || isEmpty(value)) ? true : false;
}

/** 
 * Evalua si el objeto contiene la propiedad dada. Identico a object.hasOwnProperty(key), 
 * pero usa la forma original de la función del propotipo.
 * @param {*} object Objeto objetivo
 * @param {*} key Propiedad a buscar
 */
const has = (object, key) => {
    return object != null && Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Función que permite agregar una nueva propiedad a un objeto
 * Solo si la variable existe y trae algun valor
 * @param {*} object - objeto origen
 * @param {*} property - clave o nombre de la propiedad en el objeto
 * @param {*} value - valor que se debe asignar a la propiedad
 */
const setIfNotEmpty = (object, property, value) => {
    if (value && !isNullOrEmpty(value)) object[property] = value;
};

/**
 * Metodo para clonar un objeto que tiene otros objetos como atributos,
 * realiza una copia completa. Evita una copia superficial del objeto. 
 * @param {*} obj objeto que se desea clonar 
 */
const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Función que suma o resta segundos a una fecha
 * @param {*} origin_date fecha origen
 * @param {*} seconds segundos que se a sumar o restar
 */
const addSeconds = (origin_date, seconds) => {
    let fecha = new Date(origin_date);
    fecha.setSeconds(fecha.getSeconds() + seconds);
    return fecha.toLocaleString("es-CO");
}

module.exports = {
    has,
    setIfNotEmpty,
    isNull,
    isUndefined,
    isEmpty,
    isNullOrEmpty,
    cloneObject,
    addSeconds
};