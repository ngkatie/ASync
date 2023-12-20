import { Router } from 'express';
import postingFunctions from '../data/postings.js';
import applicantFunctions from '../data/applicants.js';
import employerFunctions from '../data/employers.js';
import {
  validObjectId,
  validStr,
  validFloat,
  validInt,
  validAlphabetical
} from "./routeValidation.js";

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
    } 
    else if (userRole === 'employer') {
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
      res.status(400).json({ message: 'Invalid user type' });
    }
  } catch (e) {
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router.route('/postings').get(async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const filter = req.query.filter;

    if (searchQuery) {
      try {
        validStr(searchQuery);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid searchQuery parameter' });
      }
    }

    if (filter) {
      try {
        validStr(filter);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid filter parameter' });
      }
    }

    if (!searchQuery && !filter) {
      const postingList = await postingFunctions.getAll();
      res.status(200).json(postingList);
    } else if (searchQuery && filter) {
      const postingList = await postingFunctions.searchAndFilterPostings(searchQuery, filter);
      res.status(200).json(postingList);
    } else if (searchQuery) {
      const postingList = await postingFunctions.getPostingsBySearch(searchQuery);
      res.status(200).json(postingList);
    } else if (filter) {
      const postingList = await postingFunctions.filterPostings(filter);
      res.status(200).json(postingList);
    } else {
      res.status(400).json({ error: 'Invalid request parameters' });
    }
  } catch (e) {
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router.route('/postings/:id').get(async (req, res) => {
  //code here for posting GET request
  let postingId = null;
  try {
    postingId = validStr(req.params.id);
  } catch (e) {
    res.status(400).json({ message: e });
  }
  
  try {
    let postingInfo = null;
    let posting = await client.hGet('postings', postingId);
    if (posting) {
      postingInfo = JSON.parse(posting);
    } else {
      postingInfo = await postingFunctions.getPosting(postingId);
      await client.hSet('postings', postingId, JSON.stringify(postingInfo));
    }
    return res.status(200).json(postingInfo);
  } catch (e) {
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router.route('/postings/page/:pagenum').get(async (req, res) => {
  let page = req.params.pagenum;
  try {
    page = validInt(page);
  } catch (e) {
    res.status(400).json({ message: e })
  }

  try {
    let postingsByPageNumber = null;
    postingsByPageNumber = await postingFunctions.getPostingsByPageNumber(page);
    res.status(200).json(postingsByPageNumber);
  } catch (e) {
    const { code, err } = e;
    res.status(code).send(err);
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
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router.route('/postings/apply/:id').post(async (req, res) => {
  const { applicantId, applicantStatus } = req.body;
  try {
    const postingId = validStr(req.params.id);
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
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router
  .route('/postings/:id')
  .delete(async (req, res) => {
    let postingId = req.params.id;
    try {
      postingId = validStr(postingId);
    } catch (e) {
      res.status(400).send(e);
    }

    try {
      const deletedPosting = await postingFunctions.deletePosting(postingId);
      const employerWithDeletedPosting =
        await postingFunctions.deletePostingFromEmployer(
          deletedPosting.employerId,
          postingId
        );
      res.status(200).json(deletedPosting);
    } catch (e) {
      const { code, err } = e;
      res.status(code).send(err);
    }
  })
  .patch(async (req, res) => {
    let postingId = req.params.id;
    const updatedFields = req.body;
    try {
      postingId = validStr(postingId);
    } catch (e) {
      res.status(400).json({ message: e });
    };
    try {
      const updatedPosting = await postingFunctions.updatePosting(
        postingId,
        updatedFields
      );
      res.status(200).json(updatedPosting);
    } catch (e) {
      const { code, err } = e;
      res.status(code).send(err);
    }
  });

router.route('/applicants').get(async (req, res) => {
  try {
    const applicantList = await applicantFunctions.getAll();
    res.status(200).json(applicantList);
  } catch (e) {
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router.route('/applicants/:id').get(async (req, res) => {
  //code here for applicant GET request
  let applicant = null;
  try {
    const applicantId = validStr(req.params.id);
    applicant = await applicantFunctions.getApplicant(applicantId);
    res.status(200).json(applicant);
  } catch (e) {
    res.status(400).send(e);
  }
});

router
  .route('/applicants/:applicantId/applied-companies')
  .get(async (req, res) => {
    let applicantId = req.params.applicantId;
    try {
      applicantId = validStr(applicantId);
    } catch (e) {
      res.status(400).json({ message: e });
    }
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
    let applicantId = req.params.applicantId;
    try {
      applicantId = validStr(applicantId);
    } catch (e) {
      res.status(400).json({ message: e });
    }

    const { postingId, applicantStatus } = req.body;
    // console.log(applicantId);
    // console.log(postingId);
    // console.log(applicantStatus);
    try {
      let applicantWithUpdatedStatus =
        await employerFunctions.updateApplicantStatus(
          applicantId,
          postingId,
          applicantStatus
        );
      res.status(200).json(applicantWithUpdatedStatus);
    } catch (e) {
      const { code, err } = e;
      res.status(code).send(err);
    }
  });

router.route('/employers').get(async (req, res) => {
  try {
    const employerList = await employerFunctions.getAll();
    res.status(200).json(employerList);
  } catch (e) {
    const { code, err } = e
    res.status(code).send(err);
  }
});

router.route('/employers/:employerId/postings').get(async (req, res) => {
  let employerId = req.params.employerId;

  try {
    employerId = validStr(employerId);
  } catch (e) {
    res.status(400).json({ message: e });
  }

  try {
    let employerPostings = await employerFunctions.getEmployer(employerId);
    employerPostings = employerPostings.postings;
    res.status(200).json(employerPostings);
  } catch (e) {
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router.route('/update-profile/:userId').put(async (req, res) => {
  const updatedFields = req.body;
  let userId = req.params.userId;
  try {
    userId = validStr(userId);
  } catch (e) {
    res.status(400).json({ message: e });
  }

  try {
    if (updatedFields.role === 'applicant') {
      const updatedApplicant = await applicantFunctions.updateApplicant(
        userId,
        updatedFields
      );
      res.status(200).json(updatedApplicant);
    } 
    else if (updatedFields.role === 'employer') {
      const updatedEmployer = await employerFunctions.updateEmployer(
        userId,
        updatedFields
      );
      res.status(200).json(updatedEmployer);
    } else {
      res.status(400).json({ message: 'Invalid user type' });
    }
  } catch (e) {
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router.route('/update-photo/:userId').put(async (req, res) => {
  const { userType, photoUrl } = req.body;
  let userId = req.params.userId;
  try {
    userId = validStr(userId);
  } catch (e) {
    res.status(400).json({ message: e });
  }

  try {
    if (userType === "employer") {
      const updatedEmployer = await employerFunctions.updateCompanyLogo(
        userId,
        photoUrl
      );
      res.status(200).json(updatedEmployer);
    } 
    else {
      const updatedApplicant = await applicantFunctions.updateApplicantPhoto(
        userId,
        photoUrl
      );
      res.status(200).json(updatedApplicant);
    }
  } catch (e) {
    const { code, err } = e;
    res.status(code).send(err);
  }
});

router.route('/update-resume/:userId').put(async (req, res) => {
  const { resumeUrl } = req.body;
  let userId = req.params.userId;
  try {
    userId = validStr(userId);
  } catch (e) {
    res.status(400).json({ message: e });
  }

  try {
    const updatedApplicant = await applicantFunctions.updateApplicantResume(
      userId,
      resumeUrl
    );
    res.status(200).json(updatedApplicant);
  } catch (e) {
    console.log(e);
    const { code, err } = e;
    res.status(code).send(err);
  }
});

export default router;
