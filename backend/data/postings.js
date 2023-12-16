import { postings, employers, applicants } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import employerFunctions from './employers.js';

let exportedMethods = {
  async addPosting(
    employerId,
    jobTitle,
    companyName,
    companyLogo,
    jobType,
    numOfEmployees,
    description,
    pay,
    rate,
    skills,
    city,
    state
  ) {
    //add validation

    // const employer = await employerData.getUserById(employerId);
    // if (!employer) {
    //     throw "no employer found with given id"
    // }

    let date = new Date().toDateString();

    let newPosting = {
      employerId: new ObjectId(employerId),
      jobTitle: jobTitle,
      companyName: companyName,
      companyLogo: companyLogo,
      jobType: jobType,
      numOfEmployees: numOfEmployees,
      description: description,
      pay: pay,
      rate: rate,
      applicants: [],
      skills: skills,
      city: city,
      state: state,
      postedDate: date,
    };

    const postingCollection = await postings();
    const insertInfo = await postingCollection.insertOne(newPosting);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'could not add posting';
    }

    const newId = insertInfo.insertedId.toString();
    const posting = await this.getPosting(newId);
    posting._id = posting._id.toString();
    posting.employerId = posting.employerId.toString();

    return posting;
  },
  async getPosting(postingId) {
    if (
      !postingId ||
      typeof postingId !== 'string' ||
      postingId.trim() === ''
    ) {
      throw 'Invalid posting ID';
    }
    if (!ObjectId.isValid(postingId)) {
      throw 'Invalid ObjectID';
    }

    const postingCollection = await postings();
    const posting = await postingCollection.findOne({
      _id: new ObjectId(postingId),
    });
    if (posting === null) {
      throw 'no posting exists with the given id';
    }
    posting._id = posting._id.toString();
    posting.employerId = posting.employerId.toString();
    return posting;
  },
  async getAll() {
    const postingCollection = await postings();
    let postingList = await postingCollection.find({}).toArray();
    if (!postingList) {
      throw 'failed to get all postings';
    }
    postingList = postingList.map((posting) => {
      posting._id = posting._id.toString();
      posting.employerId = posting.employerId.toString();
      return posting;
    });
    return postingList;
  },
  async getPostingsByPageNumber(page) {
    const postingCollection = await postings();
    let skipAmount = (page - 1) * 10;
    const postingList = await postingCollection
      .find({})
      .skip(skipAmount)
      .limit(10)
      .toArray();
    return postingList;
  },
  async deletePosting(postingId) {
    //validation
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
    const postingsCollection = await postings();
    const posting = await postingsCollection.findOne({
      _id: new ObjectId(postingId),
    });

    if (!posting) {
      throw 'No posting found with the supplied ID';
    }

    //delete
    const deleteResult = await postingsCollection.deleteOne({
      _id: new ObjectId(postingId),
    });
    // console.log(deleteResult);
    if (deleteResult.deletedCount !== 1) {
      throw 'Deletion failed';
    }

    // remove postingId from applicant applied arrays
    const applicantsCollection = await applicants();
    const applicantsWithPosting = await applicantsCollection
      .find({ applied: postingId })
      .toArray();

    for (const applicant of applicantsWithPosting) {
      const updatedAppliedArray = applicant.applied.filter(
        (id) => id !== postingId
      );

      await applicantsCollection.updateOne(
        { _id: new ObjectId(applicant._id) },
        { $set: { applied: updatedAppliedArray } }
      );
    }

    posting._id = posting._id.toString();
    posting.employerId = posting.employerId.toString();
    return posting;
  },

  async updatePosting(postingId, updatedFields) {
    // updatePosting: requires an object of fields to update as second argument
    // validation
    const validFields = [
      'employerId',
      'jobTitle',
      'companyName',
      'companyLogo',
      'jobType',
      'numOfEmployees',
      'description',
      'pay',
      'rate',
      'skills',
      'city',
      'state',
    ];

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
    if (!updatedFields || typeof updatedFields !== 'object') {
      throw 'You must provide an object of updated fields';
    }
    const invalidFields = Object.keys(updatedFields).filter(
      (field) => !validFields.includes(field)
    );
    if (invalidFields.length > 0) {
      throw `Invalid fields: ${invalidFields.join(', ')}`;
    }

    const postingsCollection = await postings();
    const currentPosting = await postingsCollection.findOne({
      _id: new ObjectId(postingId),
    });

    if (!currentPosting) {
      throw 'No posting found with the supplied ID';
    }

    // update
    let updatedPosting = await postingsCollection.updateOne(
      { _id: new ObjectId(postingId) },
      { $set: updatedFields }
    );
    //console.log(updatedPosting);
    if (updatedPosting.acknowledged === false) {
      throw 'Failed to update posting';
    }

    updatedPosting = await postingsCollection.findOne({
      _id: new ObjectId(postingId),
    });
    updatedPosting._id = updatedPosting._id.toString();
    updatedPosting.employerId = updatedPosting.employerId.toString();
    return updatedPosting;
  },
  async getPostingsByEmployer(employerId) {
    // validate
    if (
      !employerId ||
      typeof employerId !== 'string' ||
      employerId.trim() === ''
    ) {
      throw 'Employer ID must be a non empty string';
    }
    if (!ObjectId.isValid(employerId)) {
      throw 'Invalid ObjectID';
    }

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });

    if (!employer) {
      throw new Error('No employer with the supplied ID');
    }

    // query postings
    const postingsCollection = await postings();
    let employerPostings = await postingsCollection
      .find({ employerId: new ObjectId(employerId) })
      .toArray();

    employerPostings = await Promise.all(
      employerPostings.map(async (posting) => {
        posting._id = posting._id.toString();
        posting.employerId = posting.employerId.toString();
        return posting;
      })
    );

    return employerPostings || [];
  },
  //getApplicants(postingId) -> check if postingId is found in applied[] field for each applicant -> if it is, add to applicants[] and return applicants[]
  async getApplicantsForPosting(postingId) {
    //gets a list of applicants for given posting
    // validation
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

    const postingsCollection = await postings();
    const currentPosting = await postingsCollection.findOne({
      _id: new ObjectId(postingId),
    });

    if (!currentPosting) {
      throw 'No posting found with the supplied ID';
    }

    // query applicants
    const applicantsCollection = await applicants();
    let applicantsArray = await applicantsCollection
      .find({ applied: postingId })
      .toArray();

    applicantsArray = await Promise.all(
      applicantsArray.map((applicant) => {
        applicant._id = applicant._id.toString();
        return applicant;
      })
    );
    return applicantsArray;
  },
  async addPostingToEmployer(employerId, postingId) {
    if (
      !employerId ||
      typeof employerId !== 'string' ||
      employerId.trim() === ''
    ) {
      throw 'Employer ID must be a non-empty string';
    }
    if (!ObjectId.isValid(employerId)) {
      throw 'Invalid ObjectID for Employer';
    }
    if (
      !postingId ||
      typeof postingId !== 'string' ||
      postingId.trim() === ''
    ) {
      throw 'Posting ID must be a non-empty string';
    }
    if (!ObjectId.isValid(postingId)) {
      throw 'Invalid ObjectID for Posting';
    }

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });

    if (!employer) {
      throw 'No employer found with the supplied ID';
    }

    const postingCollection = await postings();
    const posting = await postingCollection.findOne({
      _id: new ObjectId(postingId),
    });

    let updatedEmployer = await employersCollection.findOneAndUpdate(
      { _id: new ObjectId(employerId) },
      { $addToSet: { postings: posting } },
      { returnDocument: 'after' }
    );

    if (!updatedEmployer) {
      throw 'Failed to add posting to employer';
    }

    updatedEmployer._id = updatedEmployer._id.toString();

    return updatedEmployer;
  },
  async deletePostingFromEmployer(employerId, postingId) {
    if (
      !employerId ||
      typeof employerId !== 'string' ||
      employerId.trim() === ''
    ) {
      throw 'Employer ID must be a non-empty string';
    }
    if (!ObjectId.isValid(employerId)) {
      throw 'Invalid ObjectID for Employer';
    }
    if (
      !postingId ||
      typeof postingId !== 'string' ||
      postingId.trim() === ''
    ) {
      throw 'Posting ID must be a non-empty string';
    }
    if (!ObjectId.isValid(postingId)) {
      throw 'Invalid ObjectID for Posting';
    }

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });

    if (!employer) {
      throw 'No employer found with the supplied ID';
    }

    let updatedEmployer = await employersCollection.findOneAndUpdate(
      { _id: new ObjectId(employerId) },
      { $pull: { postings: { _id: new ObjectId(postingId) } } },
      { returnDocument: 'after' }
    );

    if (!updatedEmployer) {
      throw 'Failed to delete posting from employer';
    }

    updatedEmployer._id = updatedEmployer._id.toString();

    return updatedEmployer;
  },
};

export default exportedMethods;
