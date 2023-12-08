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

const CandidateCard = ({
  postingId,
  companyName,
  companyLogo,
  jobType,
  numOfEmployees,
  role,
  description,
  employer,
  city,
  state,
  payRate,
  status,
  applicants,
}) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: "400px" }}>
      <CardHeader title={companyName} subheader={role} />
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {city}, {state}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {numOfEmployees} employees
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Pay Rate: ${payRate}/hr
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(`/apply/${postingId}`)}
        >
          Apply
        </Button>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
