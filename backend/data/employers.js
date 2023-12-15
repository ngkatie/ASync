import { employers } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exportedMethods = {
  async addEmployer(name, email, companyName, city, state, industry) {
    //add validation

    let newEmployer = {
      name: name,
      email: email,
      companyName: companyName,
      city: city,
      state: state,
      industry: industry,
      postings: [],
    };

    const employersCollection = await employers();

    const existingEmployer = await employersCollection.findOne({
      email: email,
    });
    if (existingEmployer) {
      throw "Email is already in use";
    }

    const insertInfo = await employersCollection.insertOne(newEmployer);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "failed to add employer";
    }

    const id = insertInfo.insertedId.toString();
    const employer = await this.getEmployer(id);
    employer._id = employer._id.toString();
    return employer;
  },
  async getEmployer(employerId) {
    if (
      !employerId ||
      typeof employerId !== "string" ||
      employerId.trim() === ""
    ) {
      throw "Invalid employer ID";
    }
    if (!ObjectId.isValid(employerId)) {
      throw "Invalid ObjectID";
    }

    const employerCollection = await employers();
    const employer = await employerCollection.findOne({
      _id: new ObjectId(employerId),
    });
    if (!employer) {
      throw "no employer with the given id exists";
    }
    return employer;
  },
  async getAll() {
    const employerCollection = await employers();
    let employerList = await employerCollection.find({}).toArray();
    if (!employerList) {
      throw "failed to get all employers";
    }
    employerList = employerList.map((employer) => {
      return {
        ...employer,
        _id: employer._id.toString(),
      };
    });

    return employerList;
  },
  async updateEmployer(employerId, updatedFields) {
    const validFields = [
      "name",
      "email",
      "companyName",
      "role",
      "state",
      "city",
      "industry",
    ];

    if (
      !employerId ||
      typeof employerId !== "string" ||
      employerId.trim() === ""
    ) {
      throw "Employer ID must be a non empty string";
    }
    if (!ObjectId.isValid(employerId)) {
      throw "Invalid ObjectID";
    }
    if (!updatedFields || typeof updatedFields !== "object") {
      throw "You must provide an object of updated fields";
    }
    const invalidFields = Object.keys(updatedFields).filter(
      (field) => !validFields.includes(field)
    );
    if (invalidFields.length > 0) {
      throw `Invalid fields: ${invalidFields.join(", ")}`;
    }

    const employersCollection = await employers();
    const currentEmployer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });

    if (!currentEmployer) {
      throw "No employer found with the supplied ID";
    }

    let updatedEmployer = await employersCollection.updateOne(
      { _id: new ObjectId(employerId) },
      { $set: updatedFields }
    );
    //console.log(updatedEmployer);
    if (updatedEmployer.acknowledged === false) {
      throw "Failed to update employer";
    }

    updatedEmployer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });
    return updatedEmployer;
  },
  async deleteEmployer(employerId) {
    if (
      !employerId ||
      typeof employerId !== "string" ||
      employerId.trim() === ""
    ) {
      throw "Employer ID must be a non empty string";
    }
    if (!ObjectId.isValid(employerId)) {
      throw "Invalid ObjectID";
    }
    const employersCollection = await employers();
    const employer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });

    if (!employer) {
      throw "No employer found with the supplied ID";
    }

    const deleteResult = await employersCollection.deleteOne({
      _id: new ObjectId(employerId),
    });
    // console.log(deleteResult);
    if (deleteResult.deletedCount !== 1) {
      throw "Deletion failed";
    }
    return employer;
  },
};

export default exportedMethods;
