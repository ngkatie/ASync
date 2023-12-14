import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployerCard from "./EmployerCard";
import Navbar from "./Navbar";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PostingCard from "./PostingCard";

function Postings() {
  const [postings, setPostings] = useState([]);
  const [currentSelectedPostingId, setCurrentSelectedPostingId] = useState("");
  const [currentSelectedPosting, setCurrentSelectedPosting] = useState({});

  useEffect(() => {
    async function fetchData() {
      let postingList = await axios.get("http://localhost:3000/api/postings");
      setPostings(postingList.data);
      console.log(postingList.data);
      if (postingList.data) {
        setCurrentSelectedPostingId(postingList.data[0]._id);
      }
    }
    fetchData();
  }, []);

  const currentUserState = useSelector((state) => state.user);

  useEffect(() => {
    console.log(currentUserState);
  }, [currentUserState]);

  useEffect(() => {
    async function fetchData() {
      let posting = await axios.get(
        `http://localhost:3000/api/postings/${currentSelectedPostingId}`
      );
      setCurrentSelectedPosting(posting.data);
      console.log(posting.data);
    }
    fetchData();
  }, [currentSelectedPostingId]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          mt: 20,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mr: 10,
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
                setCurrentSelectedPostingId={setCurrentSelectedPostingId}
              />
              // </Link>
            ))}
        </Box>
        {currentSelectedPostingId && currentSelectedPosting && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid rgba(0, 0, 0, 0.2)",
              borderRadius: 5,
              minHeight: 600,
              minWidth: 500,
              maxWidth: 600,
              overflowY: "auto",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontSize: 24 }}>
                {currentSelectedPosting.jobTitle}
              </Typography>
              <Typography sx={{ mb: 4 }}>
                {currentSelectedPosting.companyName} |{" "}
                {currentSelectedPosting.city}, {currentSelectedPosting.state} |
                __ applicants
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                <Typography>{currentSelectedPosting.jobType}</Typography>
                <Typography>
                  {currentSelectedPosting.numOfEmployees} employees
                </Typography>
                <Typography>Skills: {currentSelectedPosting.skills}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  Pay Rate: ${currentSelectedPosting.pay}/
                  {currentSelectedPosting.rate}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ fontSize: 20, mb: 2 }}>About</Typography>
                <Typography sx={{ textAlign: "left" }}>
                  {currentSelectedPosting.description}
                </Typography>
              </Box>
              {currentUserState && currentUserState.role === "applicant" && (
                <Button variant="contained">Apply</Button>
              )}
            </Box>
          </Box>
        )}
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
