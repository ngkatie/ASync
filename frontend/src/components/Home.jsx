import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  const currentUserRole = useSelector((state) => state.user.role);

  // useEffect(() => {
  //   // console.log(currentUser);
  //   console.log(currentUserState);
  // }, [currentUserState]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "50%",
          margin: "auto",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Welcome to Application Sync
        </Typography>
        <Typography variant="h7" sx={{ marginBottom: 2 }}>
          For Applicants: Search through a ton of postings that have been
          carefully chosen based on your experience and interests. Make a
          profile now to find your ideal position or internship.
        </Typography>
        <Typography variant="h7" sx={{ marginBottom: 2 }}>
          For Employers: Create and easily maintain job advertisements with
          ease. Examine applications and maintain organization with our simple
          job application board to update applicants' statuses.
        </Typography>
        <Typography variant="h7" sx={{ marginBottom: 1 }}>
          Ready to Sync?
        </Typography>

        {currentUser ? (
          currentUserRole === "employer" ? (
            <Button
              href="/create-posting"
              variant="outlined"
              sx={{ fontSize: 16 }}
            >
              Create a job posting
            </Button>
          ) : (
            <Button href="/postings" variant="outlined" sx={{ fontSize: 16 }}>
              View postings
            </Button>
          )
        ) : (
          <Button href="/register" variant="outlined" sx={{ fontSize: 16 }}>
            Get started here
          </Button>
        )}
      </Box>
    </>
  );
};

export default Home;
