import { applicants, postings, employers } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import postingFunctions from './postings.js';
import {
  validObjectId,
  validStr,
  validFloat,
  validInt,
  validAlphabetical,
  validEmail,
  validState
} from "./validation.js";
import fs from 'fs';
import axios from 'axios';

import gm from "gm";
var im = gm.subClass({ imageMagick: true });

let exportedMethods = {
  async addApplicant(name, email, city, state, industry) {

    name = validAlphabetical(name);
    email = validEmail(email);
    city = validAlphabetical(city);
    state = validState(state);
    industry = validStr(industry);

    let newApplicant = {
      name: name,
      email: email,
      city: city,
      state: state,
      industry: industry,
      applied: [], // Array of postingIds that the applicant has applied to and respective statuses
      photoUrl: null,
      resumeUrl: null
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
      throw 'Failed to add applicant';
    }

    const id = insertInfo.insertedId.toString();
    const applicant = await this.getApplicant(id);
    applicant._id = applicant._id.toString();
    return applicant;
  },

  async getApplicant(applicantId) {
    try {
      applicantId = validStr(applicantId);
    } catch (e) {
      throw {code: 400, err: e}
    }

    const applicantCollection = await applicants();
    const applicant = await applicantCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!applicant) {
      throw {
        code: 404,
        err: 'No applicant with the given id exists'
      };
    }
    applicant._id = applicant._id.toString();
    return applicant;
  },

  async getAll() {
    const applicantCollection = await applicants();
    let applicantList = await applicantCollection.find({}).toArray();
    if (!applicantList) {
      throw {
        code: 500,
        err: 'Failed to get all applicants'
      };
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
    try {
      applicantId = validStr(applicantId);

      if (!updatedFields || typeof updatedFields !== 'object') {
        throw 'You must provide an object of updated fields';
      }
      const invalidFields = Object.keys(updatedFields).filter(
        (field) => !validFields.includes(field)
      );
      if (invalidFields.length > 0) {
        throw `Invalid fields: ${invalidFields.join(', ')}`;
      }
    } catch (e) {
      throw { code: 400, err: e }
    }

    const applicantsCollection = await applicants();
    const existingApplicant = await applicantsCollection.findOne({
      email: updatedFields.email,
    });
    if (existingApplicant) {
      throw {
        code: 400,
        err: 'Email is already in use'
      };
    }

    const currentApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!currentApplicant) {
      throw {
        code: 404,
        err: 'No applicant found with the supplied ID'
      };
    }

    let updatedApplicant = await applicantsCollection.updateOne(
      { _id: new ObjectId(applicantId) },
      { $set: updatedFields }
    );
    if (updatedApplicant.acknowledged === false) {
      throw {
        code: 500,
        err: 'Failed to update applicant'
      };
    }

    updatedApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    updatedApplicant._id = updatedApplicant._id.toString();
    return updatedApplicant;
  },

  async updateApplicantResume(applicantId, resumeUrl) {
    try {
      applicantId = validStr(applicantId);
    } catch (e) {
      throw { code: 400, err: e }
    }

    const applicantsCollection = await applicants();

    const currentApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId)
    });
    if (!currentApplicant) {
      throw {code: 404, err: 'No applicant found with the supplied ID'};
    }

    let updatedApplicant = await applicantsCollection.updateOne(
      { _id: new ObjectId(applicantId) },
      { $set: {
        resumeUrl: resumeUrl
      }}
    );
    if (updatedApplicant.acknowledged === false) {
      throw {
        code: 500,
        err: 'Failed to update applicant resume'
      };
    }

    updatedApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    updatedApplicant._id = updatedApplicant._id.toString();
    return updatedApplicant;
  },

  async updateApplicantPhoto(applicantId, photoUrl) {
    try {
      applicantId = validStr(applicantId);
    } catch (e) {
      throw { code: 400, err: e }
    }

    const applicantsCollection = await applicants();

    const currentApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId)
    });
    if (!currentApplicant) {
      throw {code: 404, err: 'No applicant found with the supplied ID'};
    }

    try {
      console.log("MAGICCCCCCC");
  
      // Ensure the /temp/ directory exists
      fs.mkdirSync('/temp/', { recursive: true });
  
      // Download the image locally
      const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
      const localFilePath = `/temp/${applicantId}.jpg`;
  
      // Write the downloaded image to a local file
      fs.writeFileSync(localFilePath, Buffer.from(response.data));
      console.log(localFilePath);
      // Resize and write to the new file
      gm(localFilePath).resize(200, 200).write(`${applicantId}_revised.jpg`, function (err) {
        if (!err) console.log('Success');
        else console.log(err);
      });
  
  } catch (e) {
      console.error("Error:", e);
      throw { code: 500, err: e };
  }

    let updatedApplicant = await applicantsCollection.updateOne(
      { _id: new ObjectId(applicantId) },
      { $set: {
        photoUrl: photoUrl
      }}
    );
    if (updatedApplicant.acknowledged === false) {
      throw {
        code: 500,
        err: 'Failed to update applicant photo'
      };
    }

    updatedApplicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    updatedApplicant._id = updatedApplicant._id.toString();
    return updatedApplicant;
  },

  async deleteApplicant(applicantId) {
    try {
      applicantId = validStr(applicantId);
    } catch (e) {
      throw { code: 400, err: e }
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

    if (deleteResult.deletedCount !== 1) {
      throw 'Deletion failed';
    }
    applicant._id = applicant._id.toString();
    return applicant;
  },

  async getPostingsAppliedByApplicant(applicantId) {
    // get all postings that an applicant has applied to
    try {
      applicantId = validStr(applicantId);
    } catch (e) {
      throw {code: 400, err: e};
    }

    const applicantsCollection = await applicants();
    const applicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });

    if (!applicant) {
      throw {
        code: 404,
        err: 'No applicant found with the supplied ID'
      };
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
    try {
      applicantId = validStr(applicantId);
      postingId = validStr(postingId);
    } catch (e) {
      throw {code: 400, err: e};
    }

    const applicantsCollection = await applicants();
    const applicant = await applicantsCollection.findOne({
      _id: new ObjectId(applicantId),
    });
    if (!applicant) {
      throw {
        code: 404,
        err: 'No applicant found with the supplied ID'
      };
    }
    if (applicant.applied.includes(postingId)) {
      throw {
        code: 400,
        err: 'Applicant has already applied to this posting'
      };
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
      throw {
        code: 500,
        err: `Failed to add postingId to applicant's applied list`
      };
    }

    //add applicantId to applicants field of postings
    const postingsCollection = await postings();
    const updatedPosting = await postingsCollection.updateOne(
      { _id: new ObjectId(postingId) },
      { $addToSet: { applicants: applicantId } }
    );

    if (updatedPosting.acknowledged === false) {
      throw {
        code: 500,
        err: `Failed to add applicantId to posting's applicants list`
      };
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
      throw {
        code: 404,
        err: 'No employer found for the posting'
      };
    }

    const updatedEmployer = await employersCollection.updateOne(
      {
        _id: new ObjectId(postingWithNewApplicant.employerId),
        'postings._id': new ObjectId(postingId),
      },
      { $addToSet: { 'postings.$.applicants': applicantId } }
    );

    if (updatedEmployer.acknowledged === false) {
      throw {
        code: 500,
        err: `Failed to add applicantId to employer's posting's applicants list`
      };
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
