import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  CardHeader,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PostingCard = ({
  postingId,
  jobTitle,
  companyName,
  companyLogo,
  jobType,
  numOfEmployees,
  description,
  employer,
  city,
  state,
  pay,
  rate,
  status,
  applicants,
  setCurrentSelectedPostingId,
}) => {
  const navigate = useNavigate();

  const currentUserState = useSelector((state) => state.user);

  return (
    <Card
      sx={{ width: "400px", mb: 5, minHeight: 150, cursor: "pointer" }}
      onClick={() => setCurrentSelectedPostingId(postingId)}
    >
      <CardHeader title={jobTitle} subheader={companyName} />
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {city}, {state}
        </Typography>
        {/* <Typography color="textSecondary" gutterBottom>
          {numOfEmployees} employees
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Pay Rate: ${pay}/{rate}
        </Typography> */}

        {/* {currentUserState && currentUserState.role === "employer" ? (
          <Button
            variant="contained"
            onClick={() => navigate(`/postings/${postingId}`)}
          >
            View
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => setCurrentSelectedPostingId(postingId)}
          >
            Apply
          </Button>
        )} */}
      </CardContent>
    </Card>
  );
};

export default PostingCard;
