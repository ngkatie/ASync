import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControl, Select, MenuItem } from '@mui/material';

const CandidateView = ({ id, role, description, employer, city, state, payRate, status, applicants }) => {
  const [applicantStatus, setApplicantStatus] = useState(status || 'Not Applied');

  const handleApplicantStatusChange = (newStatus) => {
    setApplicantStatus(newStatus);
    // UPDATE STATUS OF CANDIDATE IN DB
  };

  return (
    <Card sx={{ width: '400px' }}>
        <CardContent>
            <Typography variant="h5" component="div">
                {role}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                {employer} - {city}, {state}
            </Typography>
            <Typography variant="body2" component="div">
            {   description}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                Pay Rate: {payRate}
            </Typography>

            <FormControl>
            <Select value={applicantStatus} onChange={(e) => handleApplicantStatusChange(e.target.value)}>
                <MenuItem value="Not Applied">Not Applied</MenuItem>
                <MenuItem value="Applied">Applied</MenuItem>
            </Select>
            </FormControl>

            <Typography variant="h6" component="div" style={{ marginTop: '20px' }}>
                Application Status:
            </Typography>
            <Typography variant="subtitle1">{applicantStatus}</Typography>
        </CardContent>
    </Card>
  );
};

export default CandidateView;