import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  CardHeader,
} from "@mui/material";

const CandidateView = ({
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
  const [applicantStatus, setApplicantStatus] = useState(
    status || "Not Applied"
  );

  const handleApplicantStatusChange = (newStatus) => {
    setApplicantStatus(newStatus);
    // UPDATE STATUS OF CANDIDATE IN DB
  };

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

        <FormControl>
          <Select
            value={applicantStatus}
            onChange={(e) => handleApplicantStatusChange(e.target.value)}
          >
            <MenuItem value="Not Applied">Not Applied</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="h6" component="div" style={{ marginTop: "20px" }}>
          Application Status:
        </Typography>
        <Typography variant="subtitle1">{applicantStatus}</Typography>
      </CardContent>
    </Card>
  );
};

export default CandidateView;
