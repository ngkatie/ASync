import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployerCard from "./EmployerCard";
import Navbar from "./Navbar";
import { Box, Button, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PostingCard from "./PostingCard";
import PostingDetailsModal from "./PostingDetailsModal";

function Postings() {
  let { page } = useParams();
  page = Number(page);

  const [postings, setPostings] = useState([]);
  const [currentSelectedPostingId, setCurrentSelectedPostingId] = useState("");
  const [currentSelectedPosting, setCurrentSelectedPosting] = useState({});

  useEffect(() => {
    async function fetchData() {
      let postingList = await axios.get("http://localhost:3000/api/postings");
      setPostings(postingList.data);
      console.log(postingList.data);
      if (postingList.data.length !== 0) {
        setCurrentSelectedPostingId(postingList.data[0]._id);
      }
    }
    fetchData();
  }, [page]);

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
          <PostingDetailsModal
            currentSelectedPosting={currentSelectedPosting}
            currentUserState={currentUserState}
          />
        )}
      </Box>
    </>
  );
}

export default Postings;
