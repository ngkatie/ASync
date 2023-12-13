import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployerCard from "./EmployerCard";
import Navbar from "./Navbar";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PostingCard from "./PostingCard";

function Postings() {
  //   postings = [
  //     {
  //       id: 1,
  //       role: "SWE",
  //       description: "super cool SWE job",
  //       employer: "ASync",
  //       city: "NYC",
  //       state: "NY",
  //       payRate: "$150000",
  //       staus: "open",
  //       applicants: [
  //         { id: 1, name: "Adam" },
  //         { id: 2, name: "John" },
  //       ],
  //     },
  //   ];

  const [postings, setPostings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let postingList = await axios.get("http://localhost:3000/api/postings");
      setPostings(postingList.data);
      console.log(postingList.data);
    }
    fetchData();
  }, []);

  const currentUserState = useSelector((state) => state.user);

  useEffect(() => {
    // console.log(currentUser);
    console.log(currentUserState);
  }, [currentUserState]);

  return (
    <>
      <Navbar />
      {/* check whether the current user is an employer or an applicant/candidate */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 20,
        }}
      >
        {postings &&
          postings.map((posting) => (
            // <Link to={`/postings/${posting._id}`} key={posting._id}>
            <PostingCard
              key={posting._id}
              postingId={posting._id}
              jobTitle={posting.jobTitle}
              companyName={posting.companyName}
              companyLogo={posting.companyLogo}
              jobType={posting.jobType}
              numOfEmployees={posting.numOfEmployees}
              description={posting.description}
              pay={posting.pay}
              rate={posting.rate}
              applicants={posting.applicants}
              skills={posting.skills}
              city={posting.city}
              state={posting.state}
              postedDate={posting.postedDate}
            />
            // </Link>
          ))}
      </Box>
      {/* <h1> EMPLOYER VIEW </h1>
      {postings.map((posting) => (
        <EmployerCard
          key={posting.id}
          id={posting.id}
          role={posting.role}
          description={posting.description}
          employer={posting.employer}
          city={posting.city}
          state={posting.state}
          payRate={posting.payRate}
          status={posting.status}
          applicants={posting.applicants}
        />
      ))}

      <h1> CANDIDATE VIEW </h1>
      {postings.map((posting) => (
        <CandidateCard
          key={posting.id}
          id={posting.id}
          role={posting.role}
          description={posting.description}
          employer={posting.employer}
          city={posting.city}
          state={posting.state}
          payRate={posting.payRate}
          status={posting.status}
          applicants={posting.applicants}
        />
      ))} */}
    </>
  );
}

export default Postings;
