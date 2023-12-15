import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import React from "react";

const PostingDetailsModal = (props) => {
  const {
    currentSelectedPosting,
    currentUserState,
    setPostings,
    setCurrentSelectedPosting,
  } = props;

  const handleDeletePosting = async () => {
    try {
      let deletedPosting = await axios.delete(
        `http://localhost:3000/api/postings/${currentSelectedPosting._id}`
      );
      setPostings((prevPostings) =>
        prevPostings.filter(
          (posting) => posting._id !== currentSelectedPosting._id
        )
      );
      setCurrentSelectedPosting({});
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Box>
      {currentSelectedPosting._id !== undefined && (
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
            p: 2,
            ml: 10,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 24 }}>
              {currentSelectedPosting.jobTitle}
            </Typography>
            <Typography sx={{ mb: 4 }}>
              {currentSelectedPosting.companyName} |{" "}
              {currentSelectedPosting.city}, {currentSelectedPosting.state} | __
              applicants
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
          </Box>
          {currentUserState && currentUserState.role === "applicant" && (
            <Button variant="contained">Apply</Button>
          )}
          {currentUserState && currentUserState.role === "employer" && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeletePosting}
            >
              Delete
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PostingDetailsModal;
