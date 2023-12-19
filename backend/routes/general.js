import { Router } from 'express';
import postingFunctions from '../data/postings.js';
import applicantFunctions from '../data/applicants.js';
import employerFunctions from '../data/employers.js';
import * as validation from "./routeValidation.js"

const router = Router();

// **** REDIS ****
import redis from 'redis';
const client = redis.createClient();
client.connect();

router.route('/login').post(async (req, res) => {
  //code here for login POST request
});

router.route('/register').post(async (req, res) => {
  //code here for register POST request
  const { displayName, email, userRole, state, city, industry } = req.body;
  try {
    if (userRole === 'applicant') {
      const applicant = await applicantFunctions.addApplicant(
        displayName,
        email,
        city,
        state,
        industry
      );
      res.status(201).json(applicant);
    } else if (userRole === 'employer') {
      const { companyName } = req.body;
      // console.log(req.body);
      // console.log(email);
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
      res.status(400).json({ message: 'Invalid user type' });
    }
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

router.route('/postings').get(async (req, res) => {
  //code here for postings GET request
  try {
    const postingList = await postingFunctions.getAll();
    res.status(200).json(postingList);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.route('/postings/:id').get(async (req, res) => {
  //code here for posting GET request
  try {
    const postingId = validation.validStr(req.params.id);
    let postingInfo = null;

    let posting = await client.hGet('postings', postingId);
    if (posting) {
      postingInfo = JSON.parse(posting);
      console.log(`Posting ${postingId} from cache`);
    }
    else {
      postingInfo = await postingFunctions.getPosting(postingId);
      await client.hSet('postings', postingId, JSON.stringify(postingInfo));
    }
    return res.status(200).json(postingInfo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route('/postings/page/:pagenum').get(async (req, res) => {
  try {
    let page = validation.validInt(req.params.pagenum);
    let postingsByPageNumber = null;

    postingsByPageNumber = await postingFunctions.getPostingsByPageNumber(page);

    res.status(200).json(postingsByPageNumber);
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

router.route('/postings').post(async (req, res) => {
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
    res.status(201).json(posting);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route('/postings/apply/:id').post(async (req, res) => {
  const { applicantId, applicantStatus } = req.body;
  try {
    const postingId = validation.validStr(req.params.id);
    const applicantWithAppliedPosting = await applicantFunctions.applyToPosting(
      applicantId,
      postingId,
      applicantStatus
    );
    
    // Update cache
    const applicantInfo = await applicantFunctions.getApplicant(applicantId);
    await client.hSet('applicants', applicantId, JSON.stringify(applicantInfo));
    const postingInfo = await postingFunctions.getPosting(postingId);
    await client.hSet('postings', postingId, JSON.stringify(postingInfo));
    res.status(200).json(applicantWithAppliedPosting);
  } catch (e) {
    res.status(400).send(e);
  }
});

router
  .route('/postings/:id')
  .delete(async (req, res) => {
    const postingId = req.params.id.trim();
    try {
      const deletedPosting = await postingFunctions.deletePosting(postingId);
      const employerWithDeletedPosting =
        await postingFunctions.deletePostingFromEmployer(
          deletedPosting.employerId,
          postingId
        );
      res.status(200).json(deletedPosting);
    } catch (e) {
      res.status(400).send(e);
    }
  })
  .patch(async (req, res) => {
    const postingId = req.params.id.trim();
    const updatedFields = req.body;
    try {
      const updatedPosting = await postingFunctions.updatePosting(
        postingId,
        updatedFields
      );
      res.status(200).json(updatedPosting);
    } catch (e) {
      res.status(400).send(e);
    }
  });

router.route('/applicants').get(async (req, res) => {
  try {
    const applicantList = await applicantFunctions.getAll();
    res.status(200).json(applicantList);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route('/applicants/:id').get(async (req, res) => {
  //code here for applicant GET request
  let applicant = null;
  try {
    const applicantId = validation.validStr(req.params.id);
    // const cachedApplicant = await client.hGet('applicants', applicantId);
    // if (cachedApplicant) {
    //   applicant = JSON.parse(cachedApplicant);
    //   console.log(`Applicant ${applicantId} from cache`);
    // }
    // else {
    //   console.log('Getting applicant from API');
      applicant = await applicantFunctions.getApplicant(applicantId);
      // await client.hSet('applicants', applicantId, JSON.stringify(applicant));
    // }
    res.status(200).json(applicant);
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

router
  .route('/applicants/:applicantId/applied-companies')
  .get(async (req, res) => {
    const applicantId = req.params.applicantId.trim();
    try {
      let applicantAppliedCompanies =
        await applicantFunctions.getPostingsAppliedByApplicant(applicantId);
      res.status(200).json(applicantAppliedCompanies);
    } catch (e) {
      res.status(400).send(e);
    }
  });

router
  .route('/applicants/:applicantId/update-status')
  .patch(async (req, res) => {
    const applicantId = req.params.applicantId.trim();
    const { postingId, applicantStatus } = req.body;
    console.log(applicantId);
    console.log(postingId);
    console.log(applicantStatus);
    try {
      let applicantWithUpdatedStatus =
        await employerFunctions.updateApplicantStatus(
          applicantId,
          postingId,
          applicantStatus
        );
      res.status(200).json(applicantWithUpdatedStatus);
    } catch (e) {
      res.status(400).send(e);
    }
  });

router.route('/employers').get(async (req, res) => {
  try {
    const employerList = await employerFunctions.getAll();
    res.status(200).json(employerList);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route('/employers/:employerId/postings').get(async (req, res) => {
  const employerId = req.params.employerId.trim();

  try {
    let employerPostings = await employerFunctions.getEmployer(employerId);
    employerPostings = employerPostings.postings;
    res.status(200).json(employerPostings);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route('/update-profile/:userId').put(async (req, res) => {
  const updatedFields = req.body;
  const userId = req.params.userId.trim();
  try {
    if (updatedFields.role === 'applicant') {
      const updatedApplicant = await applicantFunctions.updateApplicant(
        userId,
        updatedFields
      );
      res.status(200).json(updatedApplicant);
    } else if (updatedFields.role === 'employer') {
      const updatedEmployer = await employerFunctions.updateEmployer(
        userId,
        updatedFields
      );
      res.status(200).json(updatedEmployer);
    } else {
      res.status(400).json({ message: 'Invalid user type' });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
