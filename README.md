# ASync
Application Sync (ASync) is a job and internship management portal for applicants and employers, developed for CS554 (Web Development II). Employers are able to create and edit job postings for their company, review their applicants' resumes, and make an accept/reject decision. Applicants can surf the postings and filter by keywords or company name. Upon applying, their profile (including their resume) will reflect on the employer's interface for review. _Developed by Andrew Kim, Katie Ng, Eric Park, and Adam Woo._

## Technologies
This application was developed using the MERN stack (Mongo DB, Express, React, Node.js). Additional technologies include Firebase, Redis, and ImageMagick/GraphicsMagick. Our project was also deployed on an AWS EC2 Instance.

## Installation and Setup
* Please install the following binaries: [Redis](https://redis.io/download/) and [GraphicsMagick](http://www.graphicsmagick.org/) (an extension of ImageMagick).
* Ensure that MongoDB is running.
* To seed the database, navigate to the `backend` directory and run: `npm run seed`
* Start the Redis server from command line: `redis-server`
### Client
```
cd frontend
npm install
npm run dev
```
### Server
```
cd backend
npm install
npm start
```
The client will run on http://localhost:80/ and server will run on http://localhost:3000/.
