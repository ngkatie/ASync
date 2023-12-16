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
    name: 'Satya Nadella',
    email: 'satya.nadella@microsoft.com',
    companyName: 'Microsoft',
    city: 'Redmond',
    state: 'WA',
    industry: 'Technology',
  },
  {
    name: 'Mark Zuckerberg',
    email: 'mark.zuckerberg@meta.com',
    companyName: 'Meta',
    city: 'Menlo Park',
    state: 'CA',
    industry: 'Technology',
  },
  {
    name: 'Sundar Pichai',
    email: 'sundar.pichai@google.com',
    companyName: 'Google',
    city: 'Mountain View',
    state: 'CA',
    industry: 'Technology',
  },
  {
    name: 'Tim Cook',
    email: 'tim.cook@apple.com',
    companyName: 'Apple',
    city: 'Cupertino',
    state: 'CA',
    industry: 'Technology',
  },
  {
    name: 'Elon Musk',
    email: 'elon.musk@tesla.com',
    companyName: 'Tesla',
    city: 'Palo Alto',
    state: 'CA',
    industry: 'Automotive/Energy',
  },
  {
    name: 'Andy Jassy',
    email: 'andy.jassy@amazon.com',
    companyName: 'Amazon',
    city: 'Seattle',
    state: 'WA',
    industry: 'Technology',
  },
  {
    name: 'Sophie Liu',
    email: 'sophie.liu@twitter.com',
    companyName: 'Twitter',
    city: 'San Francisco',
    state: 'CA',
    industry: 'Technology',
  },
  {
    name: 'Ryan Johnson',
    email: 'ryan.johnson@uber.com',
    companyName: 'Uber',
    city: 'San Francisco',
    state: 'CA',
    industry: 'Technology',
  },
  {
    name: 'Olivia Davis',
    email: 'olivia.davis@linkedin.com',
    companyName: 'LinkedIn',
    city: 'Sunnyvale',
    state: 'CA',
    industry: 'Technology',
  },
  {
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@netflix.com',
    companyName: 'Netflix',
    city: 'Los Gatos',
    state: 'CA',
    industry: 'Entertainment',
  },
  {
    name: 'Emily Wang',
    email: 'emily.wang@salesforce.com',
    companyName: 'Salesforce',
    city: 'San Francisco',
    state: 'CA',
    industry: 'Technology',
  },
  {
    name: 'Dylan White',
    email: 'dylan.white@airbnb.com',
    companyName: 'Airbnb',
    city: 'San Francisco',
    state: 'CA',
    industry: 'Hospitality',
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@nvidia.com',
    companyName: 'Nvidia',
    city: 'Santa Clara',
    state: 'CA',
    industry: 'Technology',
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
    numOfEmployees: '10,00+',
    description: `Meta is embarking on the most transformative change to its business and technology in company history, and our Machine Learning Engineers are at the forefront of this evolution. By leading crucial projects and initiatives that have never been done before, you have an opportunity to help us advance the way people connect around the world.
 
    The ideal candidate will have industry experience working on a range of recommendation, classification, and optimization problems. You will bring the ability to own the whole ML life cycle, define projects and drive excellence across teams. You will work alongside the world’s leading engineers and researchers to solve some of the most exciting and massive social data and prediction problems that exist on the web.
     `,
    pay: '241000',
    rate: 'yr',
    skills: 'C, C++, Java, Python, Perl, PHP',
    city: 'Sunnyvale',
    state: 'CA',
  },
  {
    jobTitle: 'Frontend Developer',
    companyName: 'Google',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '100,000+',
    description: `Google is looking for a skilled Frontend Developer to join our dynamic team. As a Frontend Developer, you will be responsible for creating and implementing innovative web designs and user experiences. 

    The ideal candidate should have strong technical skills and a passion for creating visually appealing and intuitive interfaces.`,
    pay: '120,000 - 150,000',
    rate: 'year',
    skills: 'HTML, CSS, JavaScript, React, Angular, Vue.js',
    city: 'Mountain View',
    state: 'CA',
  },
  {
    jobTitle: 'UX/UI Design Intern',
    companyName: 'Apple Inc.',
    companyLogo: null,
    jobType: 'Internship',
    numOfEmployees: '147,000+',
    description: `Apple is offering an exciting internship opportunity for a UX/UI Design Intern to join our dynamic design team. As a UX/UI Design Intern, you will have the chance to work on real-world projects, collaborate with experienced designers, and contribute to the user experience of our innovative products.

    We are looking for creative individuals with a passion for design, a strong eye for detail, and a desire to learn and grow in a fast-paced environment.`,
    pay: '20 - 25',
    rate: 'hour',
    skills: 'Adobe Creative Suite, Figma, Sketch, Prototyping, User Research',
    city: 'Cupertino',
    state: 'CA',
  },
  {
    jobTitle: 'Software Engineer',
    companyName: 'Tesla, Inc.',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '70,000+',
    description: `Tesla is looking for a passionate Software Engineer to join our fast-paced team. As a Software Engineer, you will have the opportunity to work on cutting-edge technologies, contributing to the development of groundbreaking electric vehicles and sustainable energy solutions.`,
    pay: '120,000 - 150,000',
    rate: 'year',
    skills: 'Python, C++, ROS, Linux, Embedded Systems',
    city: 'Palo Alto',
    state: 'CA',
  },
  {
    jobTitle: 'Software Development Engineer',
    companyName: 'Amazon.com, Inc.',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '1,298,000+',
    description: `Amazon is seeking a talented Software Development Engineer to join our diverse and innovative team. As a Software Development Engineer, you will have the opportunity to work on challenging projects, building scalable and reliable systems that power Amazon's e-commerce and cloud computing platforms.`,
    pay: '130,000 - 160,000',
    rate: 'year',
    skills: 'Java, Python, AWS, Distributed Systems',
    city: 'Seattle',
    state: 'WA',
  },
  {
    jobTitle: 'Senior Software Engineer',
    companyName: 'Twitter, Inc.',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '9,000+',
    description: `Join Twitter's dynamic engineering team as a Senior Software Engineer. As a key member of our team, you'll play a crucial role in designing and developing features for our global social media platform. Bring your passion for innovation and creativity to shape the future of real-time communication.`,
    pay: '140,000 - 170,000',
    rate: 'year',
    skills: 'Java, Scala, JavaScript, React, Big Data Technologies',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    jobTitle: 'Software Engineer II',
    companyName: 'Uber Technologies, Inc.',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '22,000+',
    description: `Uber is looking for a skilled Software Engineer II to join our technology-driven company. As a Software Engineer II, you'll be part of a team that's revolutionizing the transportation industry. Collaborate with bright minds to build scalable and reliable systems that power our global platform.`,
    pay: '130,000 - 160,000',
    rate: 'year',
    skills: 'Python, Go, JavaScript, React, Docker',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    jobTitle: 'Software Development Engineer',
    companyName: 'LinkedIn Corporation',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '16,000+',
    description: `LinkedIn is seeking a passionate Software Development Engineer to join our mission of connecting professionals around the world. As a key member of our team, you'll have the opportunity to work on innovative projects, leveraging your skills in distributed systems and web technologies.`,
    pay: '140,000 - 170,000',
    rate: 'year',
    skills: 'Java, Spring, JavaScript, React, SQL',
    city: 'Sunnyvale',
    state: 'CA',
  },
  {
    jobTitle: 'Senior Frontend Engineer',
    companyName: 'Netflix, Inc.',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '10,000+',
    description: `Netflix is looking for a Senior Frontend Engineer to join our streaming platform team. As a Senior Frontend Engineer, you'll be instrumental in delivering an exceptional user experience to millions of subscribers worldwide. Bring your creativity and expertise to help shape the future of entertainment.`,
    pay: '150,000 - 180,000',
    rate: 'year',
    skills: 'JavaScript, React, Redux, HTML, CSS',
    city: 'Los Gatos',
    state: 'CA',
  },
  {
    jobTitle: 'Lead Software Engineer',
    companyName: 'Salesforce.com, Inc.',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '49,000+',
    description: `Salesforce is seeking a Lead Software Engineer to join our innovative and customer-centric company. As a Lead Software Engineer, you'll lead a talented team in developing scalable and secure solutions on the Salesforce platform. Join us in making a positive impact on businesses around the world.`,
    pay: '150,000 - 180,000',
    rate: 'year',
    skills: 'Apex, Java, JavaScript, Lightning Web Components',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    jobTitle: 'Senior Full Stack Engineer',
    companyName: 'Airbnb, Inc.',
    companyLogo: null,
    jobType: 'Full-time',
    numOfEmployees: '7,500+',
    description: `Airbnb is looking for a Senior Full Stack Engineer to join our dynamic team. As a Senior Full Stack Engineer, you'll contribute to building innovative features that enhance the Airbnb experience for hosts and guests. Join us in shaping the future of travel and hospitality.`,
    pay: '140,000 - 170,000',
    rate: 'year',
    skills: 'Node.js, React, GraphQL, Ruby on Rails',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    jobTitle: 'Software Engineering Intern',
    companyName: 'Nvidia',
    companyLogo: null,
    jobType: 'Internship',
    numOfEmployees: '10,000+',
    description: `Nvidia is offering an exciting internship opportunity for a Software Engineering Intern. Join our innovative team and contribute to cutting-edge projects in the field of graphics processing and artificial intelligence.

    As a Software Engineering Intern, you will collaborate with experienced engineers, participate in development projects, and gain hands-on experience in a dynamic and fast-paced environment.`,
    pay: '28',
    rate: 'hour',
    skills: 'C++, CUDA, Python, Machine Learning',
    city: 'Santa Clara',
    state: 'CA',
  },
];

const applicantSeedData = [
  {
    name: 'John Smith',
    email: 'john.smith@gmail.com',
    city: 'New York',
    state: 'NY',
    industry: 'Software Development',
  },
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@gmail.com',
    city: 'San Francisco',
    state: 'CA',
    industry: 'Data Science',
  },
  {
    name: 'Bob Wilson',
    email: 'bob.wilson@gmail.com',
    city: 'Los Angeles',
    state: 'CA',
    industry: 'Web Development',
  },
  {
    name: 'Emma Brown',
    email: 'emma.brown@gmail.com',
    city: 'Chicago',
    state: 'IL',
    industry: 'Marketing',
  },
  {
    name: 'Mike Davis',
    email: 'mike.davis@gmail.com',
    city: 'Austin',
    state: 'TX',
    industry: 'Finance',
  },
  {
    name: 'Sarah Miller',
    email: 'sarah.miller@gmail.com',
    city: 'Seattle',
    state: 'WA',
    industry: 'UX Design',
  },
  {
    name: 'Daniel Lee',
    email: 'daniel.lee@gmail.com',
    city: 'Boston',
    state: 'MA',
    industry: 'Software Engineering',
  },
  {
    name: 'Olivia White',
    email: 'olivia.white@gmail.com',
    city: 'Denver',
    state: 'CO',
    industry: 'Data Analysis',
  },
  {
    name: 'James Carter',
    email: 'james.carter@gmail.com',
    city: 'Portland',
    state: 'OR',
    industry: 'Mobile App Development',
  },
  {
    name: 'Sophia Martinez',
    email: 'sophia.martinez@gmail.com',
    city: 'Miami',
    state: 'FL',
    industry: 'Graphic Design',
  },
  {
    name: 'Elijah Taylor',
    email: 'elijah.taylor@gmail.com',
    city: 'Phoenix',
    state: 'AZ',
    industry: 'Cybersecurity',
  },
  {
    name: 'Ava Adams',
    email: 'ava.adams@gmail.com',
    city: 'Dallas',
    state: 'TX',
    industry: 'Product Management',
  },
  {
    name: 'Logan Wilson',
    email: 'logan.wilson@gmail.com',
    city: 'Atlanta',
    state: 'GA',
    industry: 'Machine Learning',
  },
  {
    name: 'Mia Thomas',
    email: 'mia.thomas@gmail.com',
    city: 'Minneapolis',
    state: 'MN',
    industry: 'Digital Marketing',
  },
  {
    name: 'Jackson Harris',
    email: 'jackson.harris@gmail.com',
    city: 'Philadelphia',
    state: 'PA',
    industry: 'Software Development',
  },
  {
    name: 'Lily Turner',
    email: 'lily.turner@gmail.com',
    city: 'Houston',
    state: 'TX',
    industry: 'Web Development',
  },
  {
    name: 'William Clark',
    email: 'william.clark@gmail.com',
    city: 'Detroit',
    state: 'MI',
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
