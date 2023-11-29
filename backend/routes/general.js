import { Router } from "express";
import postingFunctions from "../data/postings.js";

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

router.route("/applicant/:id").get(async (req, res) => {
  //code here for applicant GET request
});

export default router;
