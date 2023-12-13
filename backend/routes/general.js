import { Router } from "express";
import postingFunctions from "../data/postings.js";
import applicantFunctions from "../data/applicants.js";
import employerFunctions from "../data/employers.js";

const router = Router();

// **** REDIS ****
// import redis from 'redis';
// const client = redis.createClient();
// client.connect();

router.route("/login").post(async (req, res) => {
  //code here for login POST request
});

router.route("/register").post(async (req, res) => {
  //code here for register POST request
  const { displayName, email, userRole, state, city, industry } = req.body;
  try {
    if (userRole === "applicant") {
      const applicant = await applicantFunctions.addApplicant(
        displayName,
        email,
        city,
        state,
        industry
      );
      res.status(201).json(applicant);
    } else if (userRole === "employer") {
      const { companyName } = req.body;
      const employer = await employerFunctions.addEmployer(
        displayName,
        email,
        companyName,
        city,
        state,
        industry
      );
      res.status(201).json(employer);
    } else {
      res.status(400).json({ message: "Invalid user type" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route("/postings").get(async (req, res) => {
  //code here for postings GET request
  try {
    const postingList = await postingFunctions.getAll();
    res.status(200).json(postingList);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.route("/postings").post(async (req, res) => {
  const {
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
    state,
  } = req.body;
  try {
    const posting = await postingFunctions.addPosting(
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
    );
    const employerWithNewPosting = await postingFunctions.addPostingToEmployer(
      employerId,
      posting._id
    );
    res.status(201).json(posting);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route("/posting/:id").get(async (req, res) => {
  //code here for posting GET request
});

router.route("/applicants").get(async (req, res) => {
  try {
    const applicantList = await applicantFunctions.getAll();
    res.status(200).json(applicantList);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route("/applicant/:id").get(async (req, res) => {
  //code here for applicant GET request
});

router.route("/employers").get(async (req, res) => {
  try {
    const employerList = await employerFunctions.getAll();
    res.status(200).json(employerList);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route("/update-profile/:userId").put(async (req, res) => {
  const updatedFields = req.body;
  const userId = req.params.userId;
  try {
    if (updatedFields.role === "applicant") {
      const updatedApplicant = await applicantFunctions.updateApplicant(
        userId,
        updatedFields
      );
      res.status(200).json(updatedApplicant);
    } else if (updatedFields.role === "employer") {
      const updatedEmployer = await employerFunctions.updateEmployer(
        userId,
        updatedFields
      );
      res.status(200).json(updatedEmployer);
    } else {
      res.status(400).json({ message: "Invalid user type" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
