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
    if (!Number.isInteger(int) || isNaN(int)) {
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

function validEmail(str) {
    const email = validStr(str).toLowerCase();
    if (!EmailValidator.validate(email)) {
        throw `Error: Invalid ${email}`;
    }
    return email;
  }
  

function validState(str) {
    const state = validStr(str).toUpperCase();
    const allStates = [ 
        'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
        'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
        'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
        'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
        'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
    ];
    if (!allStates.includes(state)) {
        throw `Error: Invalid state ${state}`
    }
    return state;
}

export {
    validObjectId,
    validStr,
    validFloat,
    validInt,
    validAlphabetical,
    validEmail,
    validState
}