import { last } from "lodash";
import { users, employers } from "../config/mongoCollections";
import * as validation from "../misc/validation.js";
import bcrypt, { compareSync, hash } from "bcrypt";

const saltRounds = await bcrypt.genSalt(10);

async function createUser (
    username,
    password,
    confirmPassword,
    firstName,
    lastName,
    emailAddress,
    dateOfBirth,
    city,
    state,
    industry
) {
    // Need to add validation
    if (password !== confirmPassword){
        throw `Passwords do not match`
    }
    const hashed_password = bcrypt.hashSync(password, saltRounds);

    let newUser = {
        username: username,
        password: hashed_password,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        dateOfBirth: dateOfBirth,
        city: city,
        state: state,
        industry: industry
    }

    const userCollection = await users();
    let duplicateUser = await userCollection.findOne({username: username}); 
    if (duplicateUser) {
        throw `Unable to register; user already exists`
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw  `Could not add user successfully`
    };

    return newUser;
}

async function createEmployer (
    companyName,
    password,
    confirmPassword,
    emailAddress,
    city,
    state,
    industry
) {
    // Need to add validation
    if (password !== confirmPassword){
        throw `Passwords do not match`
    }
    const hashed_password = bcrypt.hashSync(password, saltRounds);

    let newEmployer = {
        companyName: companyName,
        password: hashed_password,
        emailAddress: emailAddress,
        dateOfBirth: dateOfBirth,
        city: city,
        state: state,
        industry: industry
    }

    const employerCollection = await employers();
    let duplicateEmployer = await employerCollection.findOne({companyName: companyName}); 
    if (duplicateEmployer) {
        throw `Unable to register; employer already exists`
    };

    const insertInfo = await employerCollection.insertOne(newEmployer);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw  `Could not add employer successfully`
    };

    return newEmployer;
}

export {
    createUser,
    createEmployer
}
