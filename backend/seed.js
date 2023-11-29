import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import postingFunctions from "./data/postings.js";

console.log("Seeding database...");
const db = await dbConnection();
await db.dropDatabase();

let posting1 = undefined;

try {
  posting1 = await postingFunctions.create(
    new ObjectId(),
    "Apple",
    null,
    "Internship",
    100000,
    "Software Engineer Internship",
    `Some responsibilities in Software Engineering may include: 
  Backend Development - Making the features that Apple users love (like Siri) work by presenting data to the user-facing applications. Backend development opportunities are available for students in the following areas: 
  Siri, iCloud, Apple Maps, Core OS, macOS, Frameworks and Applications, Interactive Media Group, Audio/Video Software Integration and Localization, Advanced Computation, iWorks, Pro Apps, Apple Music, Security, Site Reliability Engineering (SRE) and Platform Infrastructure Engineering (PIE)
  Core OS - The Core OS team is responsible for the design and development of core technologies that are deployed across all Apple product areas including the iPhone, iPad, Watch, MacBook, iMac, Apple TV, and audio accessories. (Yes, that's pretty much everything.)
  Web Development - Help build web-based tools and applications to improve our products and do more for our customers. Our developers are responsible for crafting the direction of our products by considering the architecture, performance, testing, design, and implementation. And of course we look for engineers that use our products. `,
    50,
    ["HTML", "CSS", "JavaScript", "React", "C++", "Python"],
    "New York City",
    "New York"
  );
} catch (e) {
  console.log(e);
}

console.log("Done seeding database!");
await closeConnection();
