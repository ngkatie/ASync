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
  posting1 = await postingFunctions.addPosting(
    '657d266d70ef9c0a2462b8c9',
    'Software Engineer Internship',
    'Microsoft',
    null,
    'Internship',
    '1-10',
    `Some responsibilities in Software Engineering may include:
  Backend Development - Making the features that Apple users love (like Siri) work by presenting data to the user-facing applications. Backend development opportunities are available for students in the following areas:
  Siri, iCloud, Apple Maps, Core OS, macOS, Frameworks and Applications, Interactive Media Group, Audio/Video Software Integration and Localization, Advanced Computation, iWorks, Pro Apps, Apple Music, Security, Site Reliability Engineering (SRE) and Platform Infrastructure Engineering (PIE)
  Core OS - The Core OS team is responsible for the design and development of core technologies that are deployed across all Apple product areas including the iPhone, iPad, Watch, MacBook, iMac, Apple TV, and audio accessories. (Yes, that's pretty much everything.)
  Web Development - Help build web-based tools and applications to improve our products and do more for our customers. Our developers are responsible for crafting the direction of our products by considering the architecture, performance, testing, design, and implementation. And of course we look for engineers that use our products. `,
    '40000',
    'yr',
    'HTML, CSS, JavaScript, React, C++, Python',
    'New York City',
    'New York'
  );
  for (const employer of employerSeedData) {
    try {
      await employerFunctions.addEmployer(
        employer.name,
        employer.email,
        employer.companyName,
        employer.city,
        employer.state,
        employer.industry
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
