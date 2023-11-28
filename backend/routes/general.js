import { Router } from 'express';
const router = Router();

import redis from 'redis';
const client = redis.createClient();
client.connect();


router
  .route('/login')
  .post(async (req, res) => {
    //code here for login POST request
    
  });

router
  .route('/register')
  .post(async (req, res) => {
    //code here for register POST request
    
  });

router
  .route('/postings')
  .get(async (req, res) => {
    //code here for postings GET request
    
  });

router
  .route('/posting/:id')
  .get(async (req, res) => {
    //code here for posting GET request
    
  });

router
  .route('/applicant/:id')
  .get(async (req, res) => {
    //code here for applicant GET request
    
  });

export default router;