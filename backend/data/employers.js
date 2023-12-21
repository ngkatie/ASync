import { employers, applicants } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import {
  validObjectId,
  validStr,
  validFloat,
  validInt,
  validAlphabetical,
  validEmail,
  validState
} from "./validation.js"

let exportedMethods = {
  async addEmployer(name, email, companyName, city, state, industry) {
    //add validation
    try {
      name = validAlphabetical(name);
      email = validEmail(email);
      companyName = validStr(companyName);
      city = validAlphabetical(city);
      state = validState(state);
      industry = validStr(industry);
    } catch (e) {
      throw {code: 400, err: e};
    }

    let newEmployer = {
      name: name,
      email: email,
      companyName: companyName,
      city: city,
      state: state,
      industry: industry,
      postings: [],
      companyLogo: null
    };

    const employersCollection = await employers();
  
    const existingEmployer = await employersCollection.findOne({email: email});

    if (existingEmployer) {
      throw {code: 400, err: 'Email is already in use'};
    }

    const insertInfo = await employersCollection.insertOne(newEmployer);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw {code: 500, err: 'Failed to add employer'};
    }

    const id = insertInfo.insertedId.toString();
    const employer = await this.getEmployer(id);
    employer._id = employer._id.toString();
    return employer;
  },

  async getEmployer(employerId) {
    try {
      employerId = validStr(employerId);
    } catch (e) {
      throw {code: 400, err: 'Invalid employerId'};
    }

    const employerCollection = await employers();
    const employer = await employerCollection.findOne({
      _id: new ObjectId(employerId),
    });
    if (!employer) {
      throw {code: 404, err: 'No employer with the given ID exists'};
    }
    employer._id = employer._id.toString();
    return employer;
  },

  async getAll() {
    const employerCollection = await employers();
    let employerList = await employerCollection.find({}).toArray();
    if (!employerList) {
      throw {code: 500, err: 'Failed to get all employers'};
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
      'name',
      'email',
      'companyName',
      'role',
      'state',
      'city',
      'industry',
    ];

    try {
      employerId = validStr(employerId);
    } catch (e) {
      throw {code: 400, err: 'Invalid employerId'};
    }

    if (!updatedFields || typeof updatedFields !== 'object') {
      throw {code: 400, err: 'Must provide an object of updated fields'};
    }
    const invalidFields = Object.keys(updatedFields).filter(
      (field) => !validFields.includes(field)
    );
    if (invalidFields.length > 0) {
      throw {
        code: 400, 
        err: `Invalid fields: ${invalidFields.join(', ')}`
      };
    }

    const employersCollection = await employers();
    const existingEmployer = await employersCollection.findOne({
      email: updatedFields.email,
    });
    if (existingEmployer) {
      throw {code: 400, err: 'Email is already in use'};
    }

    const currentEmployer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });
    if (!currentEmployer) {
      throw {code: 404, err: 'No employer found with the supplied ID'};
    }

    let updatedEmployer = await employersCollection.updateOne(
      { _id: new ObjectId(employerId) },
      { $set: updatedFields }
    );
    //console.log(updatedEmployer);
    if (updatedEmployer.acknowledged === false) {
      throw {code: 500, err: 'Failed to update employer'};
    }

    updatedEmployer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });
    updatedEmployer._id = updatedEmployer._id.toString();
    return updatedEmployer;
  },

  async deleteEmployer(employerId) {
    
    try {
      employerId = validStr(employerId);
    } catch (e) {
      throw {code: 400, err: 'Invalid employerId'}
    }

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });

    if (!employer) {
      throw {code: 404, err: 'No employer found with the supplied ID'};
    }

    const deleteResult = await employersCollection.deleteOne({
      _id: new ObjectId(employerId),
    });
    // console.log(deleteResult);
    if (deleteResult.deletedCount !== 1) {
      throw {code: 500, err: 'Deletion failed'};
    }
    employer._id = employer._id.toString();
    return employer;
  },

  async updateCompanyLogo(employerId, photoUrl) {
    try {
      employerId = validStr(employerId);
    } catch (e) {
      throw { code: 400, err: e }
    }

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });
    if (!employer) {
      throw {code: 404, err: 'No employer found with the supplied ID'};
    }

    // try {
    //   gm(photoUrl).resize(200, 200).write(photoUrl, function (err) {
    //     if (!err) console.log('Success');
    //   });
    // } catch (e) {
    //   console.log(e);
    //   throw {code: 500, err: e}
    // }

    let updatedEmployer = await employersCollection.updateOne(
      { _id: new ObjectId(employerId) },
      { $set: {
        companyLogo: photoUrl
      }}
    );
    if (updatedEmployer.acknowledged === false) {
      throw {
        code: 500,
        err: 'Failed to update company logo'
      };
    }

    updatedEmployer = await employersCollection.findOne({
      _id: new ObjectId(employerId),
    });
    updatedEmployer._id = updatedEmployer._id.toString();
    return updatedEmployer;
  },

  async updateApplicantStatus(applicantId, postingId, newStatus) {
    const validStatuses = ['In Progress', 'Accepted', 'Rejected'];

    try {
      applicantId = validStr(applicantId);
      postingId = validStr(postingId);

      if (!validStatuses.includes(newStatus)) {
        throw 'Invalid applicant status';
      }
    } catch (e) {
      throw {code: 400, err: 'Invalid input'};
    }

    try {
      const applicantsCollection = await applicants();
      const updateResult = await applicantsCollection.updateOne(
        {
          _id: new ObjectId(applicantId),
          'applied.postingId': new ObjectId(postingId),
        },
        {
          $set: {
            'applied.$.applicantStatus': newStatus,
          },
        }
      );

      const updatedApplicant = await applicantsCollection.findOne({
        _id: new ObjectId(applicantId),
      });

      return updatedApplicant;
    } catch (e) {
      throw {code: 500, err: e}
    }
  },
};

export default exportedMethods;
