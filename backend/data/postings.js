import { postings } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import employers from "./employers.js";

let exportedMethods = {
  async create(
    employerId,
    companyName,
    companyLogo,
    jobType,
    numOfEmployees,
    role,
    description,
    payRate,
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
      employerId: employerId,
      companyName: companyName,
      companyLogo: companyLogo,
      jobType: jobType,
      numOfEmployees: numOfEmployees,
      role: role,
      description: description,
      payRate: payRate,
      applicants: [],
      skills: skills,
      city: city,
      state: state,
      postedDate: date,
    };

    const postingCollection = await postings();
    const insertInfo = await postingCollection.insertOne(newPosting);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "could not add posting";
    }

    const newId = insertInfo.insertedId.toString();
    const posting = await this.get(newId);
    posting._id = posting._id.toString();
    return posting;
  },
  async get(id) {
    //add validation

    const postingCollection = await postings();
    const posting = await postingCollection.findOne({ _id: new ObjectId(id) });
    if (posting === null) {
      throw "no posting exists with the given id";
    }
    return posting;
  },
  async getAll() {
    const postingCollection = await postings();
    let postingList = await postingCollection.find({}).toArray();
    if (postingList.length === 0) {
      throw "could not find any postings";
    }
    postingList = postingList.map((posting) => {
      posting._id = posting._id.toString();
      posting.employerId = posting.employerId.toString();
      return posting;
    });
    return postingList;
  },
  async deletePosting(postingId) {
    //validation
    if (!postingId || typeof postingId !== 'string' || postingId.trim() === '') {
      throw 'Posting ID must be a non empty string';
    }
    if (!ObjectId.isValid(postingId)) {
      throw 'Invalid ObjectID'
    }
    const objectId = new ObjectId(postingId);
    const postingsCollection = await postings();
    const posting = await postingsCollection.findOne({ _id: objectId });

    if (!posting) {
      throw 'No posting found with the supplied ID';
    }

    //delete
    const deleteResult = await postingsCollection.deleteOne({ _id: objectId });
    // console.log(deleteResult);
    if (deleteResult.deletedCount !== 1) {
      throw 'Deletion failed';
    }
    return posting;
  },

  //updatePosting
  async updatePosting(postingId, updatedFields) {
    // validation
    if (!postingId || typeof postingId !== 'string' || postingId.trim() === '') {
      throw 'Posting ID must be a non empty string';
    }
    if (!ObjectId.isValid(postingId)) {
      throw 'Invalid ObjectID'
    }
    if (!updatedFields || typeof updatedFields !== 'object') {
      throw 'You must provide an object of updated fields'
    }

    const postingsCollection = await postings();
    const currentPosting = await postingsCollection.findOne({ _id: new ObjectId(postingId) });

    if (!currentPosting) {
      throw 'No posting found with the supplied ID'
    }

    // update

    // for (const key in updatedFields) {
    //   if (currentRecipe[key] === updatedFields[key]) {
    //     throw 'Values from supplied fields must be different from existing fields';
    //   }
    // }

    let updatedPosting = await postingsCollection.updateOne(
      { _id: new ObjectId(postingId) },
      { $set: updatedFields }
    );
      console.log(updatedPosting);
    if (updatedPosting.acknowledged === false) {
      throw 'Failed to update posting';
    }

    updatedPosting = await postingsCollection.findOne({ _id: new ObjectId(postingId) });
    return updatedPosting;
  },
  //getPosting(postingId)
  //getAll() -> get all postings in postings collection
  //getPostingsByEmployer(employerId)
  async getPostingsByEmployer(employerId) {
    // validate
    if (!employerId || typeof employerId !== 'string' || employerId.trim() === '' || !ObjectId.isValid(employerId)) {
      throw 'Invalid employer ID'
    }
    if (!ObjectId.isValid(employerId)) {
      throw 'Invalid ObjectID'
    }

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({ _id: new ObjectId(employerId) });

    if (!employer) {
      throw new Error('No employer with the supplied ID');
    }

    // query postings

    const postingsCollection = await postings();
    const employerPostings = await postingsCollection.find({ employerId: employerId }).toArray();

    return employerPostings;
  },
  //getApplicants(postingId) -> check if postingId is found in applied[] field for each applicant -> if it is, add to applicants[] and return applicants[]
  async getApplicants(postingId) {
    // validation
    if (!postingId || typeof postingId !== 'string' || postingId.trim() === '') {
      throw 'Posting ID must be a non empty string';
    }
    if (!ObjectId.isValid(postingId)) {
      throw 'Invalid ObjectID'
    }
    if (!updatedFields || typeof updatedFields !== 'object') {
      throw 'You must provide an object of updated fields'
    }

    const postingsCollection = await postings();
    const currentPosting = await postingsCollection.findOne({ _id: new ObjectId(postingId) });

    if (!currentPosting) {
      throw 'No posting found with the supplied ID'
    }

    // query applicants
    const applicantsCollection = await applicants();
    const applicants = await applicantsCollection.find({ applied: postingId });

    if (!applicants) {
      return [];
    }
    return applicants;
  },
};

export default exportedMethods;
