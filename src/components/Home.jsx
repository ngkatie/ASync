import React from "react";
import Navbar from "./Navbar";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
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

        <Button href="/register" variant="outlined" sx={{ fontSize: 16 }}>
          Get Started Here
        </Button>
      </Box>
    </>
  );
};

export default Home;
