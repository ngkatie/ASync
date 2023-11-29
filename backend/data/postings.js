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
};

export default exportedMethods;
