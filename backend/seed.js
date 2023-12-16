import { ObjectId } from 'mongodb';
import { dbConnection, closeConnection } from './config/mongoConnection.js';
import postingFunctions from './data/postings.js';
import employerFunctions from './data/employers.js';
import applicantFunctions from './data/applicants.js';

console.log('Seeding database...');
const db = await dbConnection();
await db.dropDatabase();

let posting1 = undefined;
const employerSeedData = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    companyName: 'ABC Corp',
    city: 'New York',
    state: 'NY',
    industry: 'Technology',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    companyName: 'XYZ Inc',
    city: 'San Francisco',
    state: 'CA',
    industry: 'Finance',
  },
];

const postingSeedData = [
  {
    jobTitle: 'Software Engineer Internship',
    companyName: 'Microsoft',
    companyLogo: null,
    jobType: 'Internship',
    numOfEmployees: '1-10',
    description: `Some responsibilities in Software Engineering may include:
      Backend Development - Making the features that Apple users love (like Siri) work by presenting data to the user-facing applications. Backend development opportunities are available for students in the following areas:
      Siri, iCloud, Apple Maps, Core OS, macOS, Frameworks and Applications, Interactive Media Group, Audio/Video Software Integration and Localization, Advanced Computation, iWorks, Pro Apps, Apple Music, Security, Site Reliability Engineering (SRE) and Platform Infrastructure Engineering (PIE)
      Core OS - The Core OS team is responsible for the design and development of core technologies that are deployed across all Apple product areas including the iPhone, iPad, Watch, MacBook, iMac, Apple TV, and audio accessories. (Yes, that's pretty much everything.)
      Web Development - Help build web-based tools and applications to improve our products and do more for our customers. Our developers are responsible for crafting the direction of our products by considering the architecture, performance, testing, design, and implementation. And of course we look for engineers that use our products. `,
    pay: '40000',
    rate: 'yr',
    skills: 'HTML, CSS, JavaScript, React, C++, Python',
    city: 'New York City',
    state: 'NY',
  },
  {
    jobTitle: 'Software Engineering, Machine Learning',
    companyName: 'Meta',
    companyLogo: null,
    jobType: 'Full-Time',
    numOfEmployees: '10,001+',
    description: `Meta is embarking on the most transformative change to its business and technology in company history, and our Machine Learning Engineers are at the forefront of this evolution. By leading crucial projects and initiatives that have never been done before, you have an opportunity to help us advance the way people connect around the world.
 
    The ideal candidate will have industry experience working on a range of recommendation, classification, and optimization problems. You will bring the ability to own the whole ML life cycle, define projects and drive excellence across teams. You will work alongside the world’s leading engineers and researchers to solve some of the most exciting and massive social data and prediction problems that exist on the web.
     `,
    pay: '241000',
    rate: 'yr',
    skills: 'C, C++, Java, Python, Perl, PHP',
    city: 'Sunnyvale',
    state: 'CA',
  },
];

const applicantSeedData = [
  {
    name: 'John Applicant',
    email: 'john.applicant@example.com',
    city: 'New York',
    state: 'NY',
    industry: 'Software Development',
  },
  {
    name: 'Alice Candidate',
    email: 'alice.candidate@example.com',
    city: 'San Francisco',
    state: 'CA',
    industry: 'Data Science',
  },
  {
    name: 'Bob Jobseeker',
    email: 'bob.jobseeker@example.com',
    city: 'Los Angeles',
    state: 'CA',
    industry: 'Web Development',
  },
  {
    name: 'Emma Aspirant',
    email: 'emma.aspirant@example.com',
    city: 'Chicago',
    state: 'IL',
    industry: 'Marketing',
  },
  {
    name: 'Mike Professional',
    email: 'mike.professional@example.com',
    city: 'Austin',
    state: 'TX',
    industry: 'Finance',
  },
];

try {
  for (let i = 0; i < employerSeedData.length; i++) {
    try {
      const employer = employerSeedData[i];
      const newEmployer = await employerFunctions.addEmployer(
        employer.name,
        employer.email,
        employer.companyName,
        employer.city,
        employer.state,
        employer.industry
      );
      const posting = postingSeedData[i];
      const {
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
      } = posting;
      const newPosting = await postingFunctions.addPosting(
        newEmployer._id,
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
    } catch (error) {
      console.error('Error adding employer:', error);
    }
  }
  for (const applicant of applicantSeedData) {
    try {
      await applicantFunctions.addApplicant(
        applicant.name,
        applicant.email,
        applicant.city,
        applicant.state,
        applicant.industry
      );
    } catch (error) {
      console.error('Error adding applicant:', error);
    }
  }
} catch (e) {
  console.log(e);
}

console.log('Done seeding database!');
await closeConnection();
