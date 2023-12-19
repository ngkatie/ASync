import { applicants, postings, employers } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import postingFunctions from './postings.js';

let exportedMethods = {
  async addApplicant(name, email, city, state, industry) {
    //add validation

    let newApplicant = {
      name: name,
      email: email,
      //password: password,
      city: city,
      state: state,
      industry: industry,
      applied: [], //array of postingIds that the applicant has applied to
    };

    const applicantsCollection = await applicants();

    const existingApplicant = await applicantsCollection.findOne({
      email: email,
    });
    if (existingApplicant) {
      throw 'Email is already in use';
    }

    const insertInfo = await applicantsCollection.insertOne(newApplicant);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'failed to add applicant';
    }

    const id = insertInfo.insertedId.toString();
    const applicant = await this.getApplicant(id);
    applicant._id = applicant._id.toString();
    return applicant;
  },
  async getApplicant(applicantId) {
    if (
      !applicantId ||
      typeof applicantId !== 'string' ||
      applicantId.trim() === ''
    ) {
      throw 'Applicant ID must be a non empty string';
    }
    if (!ObjectId.isValid(applicantId)) {
      throw 'Invalid ObjectID';
    }

    const applicantCollection = await applicants();
    const applicant = await applicantCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!applicant) {
      throw 'no applicant with the given id exists';
    }
    applicant._id = applicant._id.toString();
    return applicant;
  },
  async getAll() {
    const applicantCollection = await applicants();
    let applicantList = await applicantCollection.find({}).toArray();
    if (!applicantList) {
      throw 'failed to get all applicants';
    }
    applicantList = applicantList.map((applicant) => {
      return {
        ...applicant,
        _id: applicant._id.toString(),
      };
    });

    return applicantList;
  },
  async updateApplicant(applicantId, updatedFields) {
    const validFields = ['name', 'email', 'role', 'city', 'state', 'industry'];
    if (
      !applicantId ||
      typeof applicantId !== 'string' ||
      applicantId.trim() === ''
    ) {
      throw 'Applicant ID must be a non empty string';
    }
    if (!ObjectId.isValid(applicantId)) {
      throw 'Invalid ObjectID';
    }
    if (!updatedFields || typeof updatedFields !== 'object') {
      throw 'You must provide an object of updated fields';
    }
    const invalidFields = Object.keys(updatedFields).filter(
      (field) => !validFields.includes(field)
    );
    if (invalidFields.length > 0) {
      throw `Invalid fields: ${invalidFields.join(', ')}`;
    }

    const applicantsCollection = await applicants();
    const existingApplicant = await applicantsCollection.findOne({
      email: updatedFields.email,
    });
    if (existingApplicant) {
      throw 'Email is already in use';
    }

    const currentApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!currentApplicant) {
      throw 'No applicant found with the supplied ID';
    }

    let updatedApplicant = await applicantsCollection.updateOne(
      { _id: new ObjectId(applicantId) },
      { $set: updatedFields }
    );
    if (updatedApplicant.acknowledged === false) {
      throw 'Failed to update applicant';
    }

    updatedApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    updatedApplicant._id = updatedApplicant._id.toString();
    return updatedApplicant;
  },
  async deleteApplicant(applicantId) {
    if (
      !applicantId ||
      typeof applicantId !== 'string' ||
      applicantId.trim() === ''
    ) {
      throw 'Applicant ID must be a non empty string';
    }
    if (!ObjectId.isValid(applicantId)) {
      throw 'Invalid ObjectID';
    }
    const applicantsCollection = await applicants();
    const applicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!applicant) {
      throw 'No applicant found with the supplied ID';
    }

    const deleteResult = await applicantsCollection.deleteOne({
      _id: new ObjectId(applicantId),
    });
    // console.log(deleteResult);
    if (deleteResult.deletedCount !== 1) {
      throw 'Deletion failed';
    }
    applicant._id = applicant._id.toString();
    return applicant;
  },
  async getPostingsAppliedByApplicant(applicantId) {
    // get all postings that an applicant has applied to
    if (
      !applicantId ||
      typeof applicantId !== 'string' ||
      applicantId.trim() === ''
    ) {
      throw 'Applicant ID must be a non empty string';
    }
    if (!ObjectId.isValid(applicantId)) {
      throw 'Invalid ObjectID';
    }

    const applicantsCollection = await applicants();
    const applicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!applicant) {
      throw 'No applicant found with the supplied ID';
    }

    const appliedPostings = await Promise.all(
      applicant.applied.map(async (application) => {
        const postingId = application.postingId.toString();
        return await postingFunctions.getPosting(postingId);
      })
    );
    return appliedPostings;
  },
  async applyToPosting(applicantId, postingId, applicantStatus) {
    if (
      !applicantId ||
      typeof applicantId !== 'string' ||
      applicantId.trim() === ''
    ) {
      throw 'Applicant ID must be a non empty string';
    }
    if (!ObjectId.isValid(applicantId)) {
      throw 'Invalid ObjectID';
    }
    if (
      !postingId ||
      typeof postingId !== 'string' ||
      postingId.trim() === ''
    ) {
      throw 'Posting ID must be a non empty string';
    }
    if (!ObjectId.isValid(postingId)) {
      throw 'Invalid ObjectID';
    }

    const applicantsCollection = await applicants();
    const applicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    if (!applicant) {
      throw 'No applicant found with the supplied ID';
    }
    if (applicant.applied.includes(postingId)) {
      throw 'Applicant has already applied to this posting';
    }

    //add postingId to applied field of applicants
    const updatedApplicant = await applicantsCollection.updateOne(
      { _id: new ObjectId(applicantId) },
      {
        $addToSet: {
          applied: {
            postingId: new ObjectId(postingId),
            applicantStatus: applicantStatus,
          },
        },
      }
    );
    if (updatedApplicant.acknowledged === false) {
      throw `Failed to add postingId to applicant's applied list`;
    }

    //add applicantId to applicants field of postings
    const postingsCollection = await postings();
    const updatedPosting = await postingsCollection.updateOne(
      { _id: new ObjectId(postingId) },
      { $addToSet: { applicants: applicantId } }
    );

    if (updatedPosting.acknowledged === false) {
      throw `Failed to add applicantId to posting's applicants list`;
    }

    //add applicantId to the specific employer's posting's applied
    //field from the employer's collection
    const postingWithNewApplicant = await postingsCollection.findOne({
      _id: new ObjectId(postingId),
    });
    const employersCollection = await employers();
    const employer = await employersCollection.findOne({
      _id: new ObjectId(postingWithNewApplicant.employerId),
    });

    if (!employer) {
      throw 'No employer found for the posting';
    }

    const updatedEmployer = await employersCollection.updateOne(
      {
        _id: new ObjectId(postingWithNewApplicant.employerId),
        'postings._id': new ObjectId(postingId),
      },
      { $addToSet: { 'postings.$.applicants': applicantId } }
    );

    if (updatedEmployer.acknowledged === false) {
      throw `Failed to add applicantId to employer's posting's applicants list`;
    }

    const applicantWithAppliedPosting = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    applicantWithAppliedPosting._id =
      applicantWithAppliedPosting._id.toString();
    for (let application of applicantWithAppliedPosting.applied) {
      application.postingId = application.postingId.toString();
    }
    return applicantWithAppliedPosting;
  },
};

export default exportedMethods;
