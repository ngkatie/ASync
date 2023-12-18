import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, FormControl, Select, MenuItem } from '@mui/material';

const EmployerCard = (props) => {
  const [status, setStatus] = useState(props.status || 'Open');
  const [applicantStatus, setApplicantStatus] = useState({});

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    //UPDATE STATUS OF JOB IN DB
  };

  const handleApplicantStatusChange = (applicantId, newStatus) => {
    setApplicantStatus((prevStatus) => ({
      ...prevStatus,
      [applicantId]: newStatus,
    }));
    //UPDATE STATUS OF APPLICANT IN DB
  };

  const findStatus = (applicant) => {
    console.log("REACHED");
    const appInfo = applicant.applied.filter((post) => post.postingId == props.id);
    console.log(appInfo);
    return appInfo.applicantStatus
  };

  return (
    <Card sx={{ width: '400px' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {props.role}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {props.employer} - {props.city}, {props.state}
        </Typography>
        <Typography variant="body2" component="div">
          {props.description}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Pay Rate: {props.payRate}
        </Typography>

        {/* EMPLOYER VIEW CAN SET JOB OPEN OR CLOSED */}
        <FormControl>
          <Select value={status} onChange={handleStatusChange}>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>


        {/* EMPLOYER VIEW CAN MARK CANDIDATES AS IN PROGREESS, ACCEPTED, OFFERED, OR REJECTED */}
        <Typography variant="h6" component="div" style={{ marginTop: '20px' }}>
          Applicants:
        </Typography>
        {props.applicants.map((applicant) => (
          <div key={applicant.id} style={{ marginBottom: '10px' }}> 
          
            <Typography variant="subtitle1">{applicant.name}</Typography>
            <FormControl>
              <Select
                value={applicant.applied.filter(
                  (post) => post.postingId == props.id
                  ).applicantStatus
                }
                onChange={(e) => handleApplicantStatusChange(applicant.id, e.target.value)}
              >
                <MenuItem value="Not Applied">Not Applied</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Offered">Offered</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
              </Select>
            </FormControl>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmployerCard;