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
  const { displayName, email, userRole, state, city } = req.body;
  try {
    if (userRole === "applicant") {
      const applicant = await applicantFunctions.addApplicant(
        displayName,
        email,
        "05/31/2002",
        city,
        state,
        "Software"
      );
      res.status(201).json(applicant);
    }
    // else if (userRole === "employer") {
    //   // const employer = await employerFunctions.addEmployer(null, )
    // }
    else {
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

export default router;
