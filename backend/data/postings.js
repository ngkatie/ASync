import { postings, employers, applicants } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import employerFunctions from './employers.js';
import { 
  validObjectId,
  validStr,
  validFloat,
  validInt,
  validAlphabetical,
  validEmail,
  validState
 } from './validation.js';

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
    
    try {
      employerId = validStr(employerId);
      jobTitle = validStr(jobTitle);
      companyName = validStr(companyName);
      jobType = validStr(jobType);
      numOfEmployees = validStr(numOfEmployees);
      description = validStr(description);
      pay = validFloat(pay);
      rate = validStr(rate);
      skills = validStr(skills);
      city = validAlphabetical(city);
      state = validState(state);
    } catch (e) {
      throw {code: 400, err: e}
    }

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
      throw {code: 500, err: 'Could not add posting'};
    }

    const newId = insertInfo.insertedId.toString();
    const posting = await this.getPosting(newId);

    const employerWithNewPosting = await this.addPostingToEmployer(
      employerId,
      posting._id
    );

    posting._id = posting._id.toString();
    posting.employerId = posting.employerId.toString();

    return posting;
  },

  async getPosting(postingId) {
    try {
      postingId = validStr(postingId);
    } catch (e) {
      throw {code: 400, err: e};
    }

    try {
      const postingCollection = await postings();
      const posting = await postingCollection.findOne({
        _id: new ObjectId(postingId),
      });
      if (posting === null) {
        throw 'No posting exists with the given postingId';
      }
      posting._id = posting._id.toString();
      posting.employerId = posting.employerId.toString();
      return posting;
    } catch (e) {
      throw {code: 500, err: e}
    }
  },

  async getAll() {
    const postingCollection = await postings();
    let postingList = await postingCollection.find({}).toArray();
    if (!postingList) {
      throw {code: 500, err: 'Failed to get all postings'};
    }
    postingList = postingList.map((posting) => {
      posting._id = posting._id.toString();
      posting.employerId = posting.employerId.toString();
      return posting;
    });
    return postingList;
  },

  async getPostingsByPageNumber(page) {
    try {
      const postingCollection = await postings();
      let skipAmount = (page - 1) * 10;
      const postingList = await postingCollection
        .find({})
        .skip(skipAmount)
        .limit(10)
        .toArray();
      return postingList;
    } catch (e) {
      throw {code: 500, err: e}
    }
  },
  async deletePosting(postingId) {
    //validation
    postingId = validStr(postingId);
    const postingsCollection = await postings();
    const posting = await postingsCollection.findOne({
      _id: new ObjectId(postingId),
    });

    if (!posting) {
      throw {
        code: 404, 
        err: 'No posting found with the supplied ID'
      };
    }

    //delete
    const deleteResult = await postingsCollection.deleteOne({
      _id: new ObjectId(postingId),
    });
    
    if (deleteResult.deletedCount !== 1) {
      throw {
        code: 500,
        err: 'Deletion failed'
      };
    }

    //remove postingId from applicant applied arrays
    const applicantsCollection = await applicants();
    const updateResult = await applicantsCollection.updateMany(
      { 'applied.postingId': new ObjectId(postingId) },
      { $pull: { applied: { postingId: new ObjectId(postingId) } } }
    );
    // console.log(updateResult);
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
      'jobType',
      'numOfEmployees',
      'description',
      'pay',
      'rate',
      'skills',
      'city',
      'state',
    ];
    
    try {
      postingId = validStr(postingId);
    } catch (e) {
      throw {code: 400, err: e}
    }
    if (!updatedFields || typeof updatedFields !== 'object') {
      throw {code: 400, err: 'You must provide an object of updated fields'};
    }
    const invalidFields = Object.keys(updatedFields).filter(
      (field) => !validFields.includes(field)
    );
    if (invalidFields.length > 0) {
      throw {code: 400, err: `Invalid fields: ${invalidFields.join(', ')}`};
    }

    const postingsCollection = await postings();
    const currentPosting = await postingsCollection.findOne({
      _id: new ObjectId(postingId),
    });

    if (!currentPosting) {
      throw {
        code: 404,
        err: 'No posting found with the supplied ID'
      };
    }

    // update
    let updatedPosting = await postingsCollection.updateOne(
      { _id: new ObjectId(postingId) },
      { $set: updatedFields }
    );
  
    if (updatedPosting.acknowledged === false) {
      throw {
        code: 500,
        err: 'Failed to update posting'
      };
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
    try {
      employerId = validStr(employerId);
      postingId = validStr(postingId);
    } catch (e) {
      throw {code: 400, err: e};
    }

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });

    if (!employer) {
      throw {
        code: 404,
        err: 'No employer found with the supplied ID'
      };
    }

    let updatedEmployer = await employersCollection.findOneAndUpdate(
      { _id: new ObjectId(employerId) },
      { $pull: { postings: { _id: new ObjectId(postingId) } } },
      { returnDocument: 'after' }
    );

    if (!updatedEmployer) {
      throw {
        code: 500,
        err: 'Failed to delete posting from employer'
      };
    }

    updatedEmployer._id = updatedEmployer._id.toString();

    return updatedEmployer;
  },

  
  async getPostingsBySearch(searchQuery) {
    try {
      searchQuery = validStr(searchQuery);
    } catch (e) {

      throw { code: 400, err: e };
    }
  
    const postingsCollection = await postings();
  
    // Create a regular expression for case-insensitive search
    const regex = new RegExp(searchQuery, 'i');
  
    const postingList = await postingsCollection
      .find({
        $or: [
          { jobTitle: { $regex: regex } },
          { description: { $regex: regex } },
          { companyName: { $regex: regex } },
          { state: { $regex: regex } },
          { city: { $regex: regex } },
          { skills: { $regex: regex } },
          { jobType: {$regex: regex} },
        ],
      })
      .toArray();
  
    if (!postingList) {

      throw {
        code: 500,
        err: 'Failed to get postings by search',
      };
    }
  
    const formattedList = postingList.map((posting) => {
      return {
        ...posting,
        _id: posting._id.toString(),
      };
    });
  
    return formattedList;
  },

  async filterPostings(filter) {
    try {
      if (!filter || typeof filter !== 'string' || filter.trim() === '') {
        throw 'Filter value must be a non-empty string';
      }
  
      const postingsCollection = await postings();
  
      // Create a regular expression for case-insensitive search
      const regex = new RegExp(filter, 'i');
  
      const filteredPostings = await postingsCollection
        .find({ companyName: { $regex: regex } })
        .toArray();
  
      if (!filteredPostings) {
        throw {
          code: 500,
          err: 'Failed to filter postings',
        };
      }
  
      const formattedList = filteredPostings.map((posting) => ({
        ...posting,
        _id: posting._id.toString(),
      }));
  
      return formattedList;
    } catch (error) {
      throw { code: 400, err: error };
    }
  },

  async searchAndFilterPostings(searchQuery, filter) {
    try {
      if (!filter || typeof filter !== 'string' || filter.trim() === '') {
        throw 'Filter value must be a non-empty string';
      }
      if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
        throw 'searchQuery value must be a non-empty string';
      }
      searchQuery = validStr(searchQuery);
      filter = validStr(filter);
  
      const postingsCollection = await postings();
  
      // Create a regular expression for case-insensitive search
      const regex = new RegExp(searchQuery, 'i');
  
      const query = {
        $or: [
          { jobTitle: { $regex: regex } },
          { description: { $regex: regex } },
          { companyName: { $regex: regex } },
          { state: { $regex: regex } },
          { city: { $regex: regex } },
          { skills: { $regex: regex } },
          { jobType: { $regex: regex } },
        ],
      };
  
      if (filter) {
        // Add filter condition if filter is provided
        query.companyName = { $regex: new RegExp(filter, 'i') };
      }
  
      const postingList = await postingsCollection.find(query).toArray();
  
      if (!postingList) {
        throw {
          code: 500,
          err: 'Failed to get postings by search and filter',
        };
      }
  
      const formattedList = postingList.map((posting) => ({
        ...posting,
        _id: posting._id.toString(),
      }));
  
      return formattedList;
    } catch (error) {
      throw { code: 400, err: error };
    }
  },


};

export default exportedMethods;
