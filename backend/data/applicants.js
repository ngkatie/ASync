import { applicants } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getPosting } from "./postings.js";

let exportedMethods = {
  async addApplicant(name, email, dateOfBirth, city, state, industry) {
    //add validation

    let newApplicant = {
      name: name,
      email: email,
      dateOfBirth: dateOfBirth,
      city: city,
      state: state,
      industry: industry,
      applied: [], //array of postingIds that the applicant has applied to
    };

    const applicantsCollection = await applicants();
    const insertInfo = await applicantsCollection.insertOne(newApplicant);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "failed to add applicant";
    }

    const id = insertInfo.insertedId.toString();
    const applicant = await this.get(id);
    applicant._id = applicant._id.toString();
    return applicant;
  },
  async getApplicant(applicantId) {
    if (
      !applicantId ||
      typeof applicantId !== "string" ||
      applicantId.trim() === ""
    ) {
      throw "Applicant ID must be a non empty string";
    }
    if (!ObjectId.isValid(applicantId)) {
      throw "Invalid ObjectID";
    }

    const applicantCollection = await applicants();
    const applicant = await applicantCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    if (!applicant) {
      throw "no applicant with the given id exists";
    }
    return applicant;
  },
  async getAll() {
    const applicantCollection = await applicants();
    let applicantList = await applicantCollection.find({}).toArray();
    if (!applicantList) {
      throw "failed to get all applicants";
    }
    applicantList = applicantList.map((applicant) => {
      applicant._id = applicant._id.toString();
    });
    return applicantList;
  },
  async updateApplicant(applicantId, updatedFields) {
    const validFields = [
      "name",
      "email",
      "dateOfBirth",
      "city",
      "state",
      "industry",
    ];

    if (
      !applicantId ||
      typeof applicantId !== "string" ||
      applicantId.trim() === ""
    ) {
      throw "Applicant ID must be a non empty string";
    }
    if (!ObjectId.isValid(applicantId)) {
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

    const applicantsCollection = await applicants();
    const currentApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!currentApplicant) {
      throw "No applicant found with the supplied ID";
    }

    let updatedApplicant = await applicantsCollection.updateOne(
      { _id: new ObjectId(applicantId) },
      { $set: updatedFields }
    );
    if (updatedApplicant.acknowledged === false) {
      throw "Failed to update applicant";
    }

    updatedApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    return updatedApplicant;
  },
  async deleteApplicant(applicantId) {
    if (
      !applicantId ||
      typeof applicantId !== "string" ||
      applicantId.trim() === ""
    ) {
      throw "Applicant ID must be a non empty string";
    }
    if (!ObjectId.isValid(applicantId)) {
      throw "Invalid ObjectID";
    }
    const applicantsCollection = await applicants();
    const applicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!applicant) {
      throw "No applicant found with the supplied ID";
    }

    const deleteResult = await applicantsCollection.deleteOne({
      _id: new ObjectId(applicantId),
    });
    // console.log(deleteResult);
    if (deleteResult.deletedCount !== 1) {
      throw "Deletion failed";
    }
    return applicant;
  },
  async getPostingsAppliedByApplicant(applicantId) {
    // get all postings that an applicant has applied to
    if (
      !applicantId ||
      typeof applicantId !== "string" ||
      applicantId.trim() === ""
    ) {
      throw "Applicant ID must be a non empty string";
    }
    if (!ObjectId.isValid(applicantId)) {
      throw "Invalid ObjectID";
    }

    const applicantsCollection = await applicants();
    const applicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!applicant) {
      throw "No applicant found with the supplied ID";
    }

    const appliedPostings = await Promise.all(
      applicant.applied.map(async (postingId) => {
        return await getPosting(postingId);
      })
    );
    return appliedPostings;
  },
  async applyToPosting(applicantId, postingId) {
    if (
      !applicantId ||
      typeof applicantId !== "string" ||
      applicantId.trim() === ""
    ) {
      throw "Applicant ID must be a non empty string";
    }
    if (!ObjectId.isValid(applicantId)) {
      throw "Invalid ObjectID";
    }
    if (
      !postingId ||
      typeof postingId !== "string" ||
      postingId.trim() === ""
    ) {
      throw "Posting ID must be a non empty string";
    }
    if (!ObjectId.isValid(postingId)) {
      throw "Invalid ObjectID";
    }

    const applicantsCollection = await applicants();
    const applicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!applicant) {
      throw "No applicant found with the supplied ID";
    }

    if (applicant.applied.includes(postingId)) {
      throw "Applicant has already applied to this posting";
    }

    const updatedApplicant = await applicantsCollection.updateOne(
      { _id: new ObjectId(applicantId) },
      { $addToSet: { applied: postingId } }
    );

    if (updatedApplicant.acknowledged === false) {
      throw `Failed to add postingId to applicant's applied list`;
    }

    updatedApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    return updatedApplicant;
  },
};

export default exportedMethods;
