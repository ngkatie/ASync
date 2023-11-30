import { applicants } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

let exportedMethods = {
  async addApplicant(
    name,
    email,
    dateOfBirth,
    city,
    state,
    industry,
  ) {
    //validation

    let newApplicant = {
      name: name,
      email: email,
      dateOfBirth: dateOfBirth,
      city: city,
      state: state,
      industry: industry,
      applied: []
    };

    const applicantsCollection = await applicants();
    const insertInfo = await applicantsCollection.insertOne(newApplicant);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'failed to add applicant'
    }

    const id = insertInfo.insertedId.toString();
    const applicant = await this.get(id);
    applicant._id = applicant._id.toString();
    return applicant;
  },
  async getApplicant(applicantId) {
    //validate and implement
  },
  async getAll() {
    //validate and implement
  },
  //deleteApplicant(applicantId) ?
  //getAll(); -> get all applicants in applicants collection
  //getApplicant(applicantId) -> get applicant that matches applicantId
  //updateApplicant(applicantId, updatedFields) -> updatedFields is an object of fields to update for applicant
  //getPostings(applicantId) -> for each entry in applied[] field in applicant, call getPosting(postingId) and add result into postings[] -> return postings[]

};

export default exportedMethods;
