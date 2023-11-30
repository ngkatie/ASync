import { employers } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exportedMethods = {
  async addEmployer(
    companyName,
    email,
    city,
    state,
    industry
  ) {
    //validation

    let newEmployer = {
      companyName: companyName,
      email: email,
      city: city,
      state: state,
      industry: industry
    };

    const employersCollection = await employers();
    const insertInfo = await employersCollection.insertOne(newEmployer);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'failed to add employer'
    }

    const id = insertInfo.insertedId.toString();
    const employer = await this.get(id);
    employer._id = employer._id.toString();
    return employer;
  },
  async getEmployer(employerId) {
    //validate and implement
  },
  async getAll() {
    //validate and implement
  },
};

export default exportedMethods;
