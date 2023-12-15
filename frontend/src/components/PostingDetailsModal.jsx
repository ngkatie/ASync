import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const PostingDetailsModal = (props) => {
  const {
    currentSelectedPosting,
    currentUserState,
    postings,
    setPostings,
    setCurrentSelectedPosting,
  } = props;

  const [isApplied, setIsApplied] = useState(false);

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

  const handleApply = async () => {
    try {
      const requestBody = { applicantId: currentUserState.userId };
      const applicantWithAppliedPosting = await axios.post(
        `http://localhost:3000/api/postings/apply/${currentSelectedPosting._id}`,
        requestBody
      );
      setIsApplied(true);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    setIsApplied(false);
    if (currentSelectedPosting && currentSelectedPosting.applicants) {
      for (const applicantId of currentSelectedPosting.applicants) {
        if (applicantId === currentUserState.userId) {
          setIsApplied(true);
          break;
        }
      }
    }
  }, [postings, currentSelectedPosting]);

  return (
    <Box>
      {currentSelectedPosting._id !== undefined && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: 5,
            minHeight: 600,
            maxHeight: 650,
            minWidth: 500,
            maxWidth: 600,
            overflowY: "auto",
            p: 2,
            ml: 10,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ fontSize: 30 }}>
                {currentSelectedPosting && currentSelectedPosting.jobTitle}
              </Typography>
              {currentUserState && currentUserState.role === "applicant" && (
                <Button
                  variant="contained"
                  disabled={isApplied}
                  onClick={handleApply}
                >
                  {isApplied ? "Already Applied" : "Apply"}
                </Button>
              )}
              {currentUserState &&
                currentUserState.role === "employer" &&
                currentUserState.userId ===
                  currentSelectedPosting.employerId && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeletePosting}
                  >
                    Delete
                  </Button>
                )}
            </Box>

            <Typography sx={{ mb: 4 }}>
              {currentSelectedPosting && currentSelectedPosting.companyName} |{" "}
              {currentSelectedPosting && currentSelectedPosting.city},{" "}
              {currentSelectedPosting && currentSelectedPosting.state} |{" "}
              {currentSelectedPosting &&
              currentSelectedPosting.applicants &&
              currentSelectedPosting.applicants.length === 1
                ? `${currentSelectedPosting.applicants.length} applicant`
                : `${currentSelectedPosting.applicants.length} applicants`}
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
        </Box>
      )}
    </Box>
  );
};

export default PostingDetailsModal;
