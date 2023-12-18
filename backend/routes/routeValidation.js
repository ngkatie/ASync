import EmailValidator from "email-validator";
import { ObjectId } from "mongodb";

function validObjectId(id) {
    id = validStr(id);
    if (!ObjectId.isValid(id)) {
        throw 'Invalid ObjectID';
    }
    return id;
}

function validStr(str) {
    if (!str || typeof str !== `string` || str.trim().length === 0) {
        throw `Error: ${str} must be a non-empty string`;
    }
    return str.trim();
}

function validFloat(arg) {
    const num = parseFloat(arg);
    if (typeof num !== 'number' || isNaN(num) || num < 0) {
        throw `Error: ${num} must be a valid number >= 0`;
    }
    return num;
}

function validInt(num) {
    const int = parseInt(num);
    if (!Number.isInteger(int) || isNaN(int) || int < 1) {
        throw `Error: Invalid ${int}`
    }
    return int;
}

function validAlphabetical(input) {
    const str = validStr(input);
    const regex = /^[A-Za-z ]+$/; 
    if (!regex.test(str) || str.length < 2) {
        throw `Error: Invalid ${str}`
    }
    return str;
}

export {
    validObjectId,
    validStr,
    validFloat,
    validInt,
    validAlphabetical
}