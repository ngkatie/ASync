import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  Dialog,
  DialogContent,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EditPostingForm from './EditPostingForm';

const PostingDetailsModal = (props) => {
  const {
    currentSelectedPosting,
    currentUserState,
    setPostings,
    setCurrentSelectedPosting,
  } = props;

  const [isApplied, setIsApplied] = useState(false);
  const [currentApplicants, setCurrentApplicants] = useState([]);
  const [applicantStatuses, setApplicantStatuses] = useState({});
  const [applicationStatus, setApplicationStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   console.log(applicantStatus);
  // }, [applicantStatus]);

  useEffect(() => {
    async function fetchData() {
      if (
        currentUserState.role === 'applicant' &&
        currentSelectedPosting &&
        currentSelectedPosting.applicants
      ) {
        setIsApplied(false);
        for (const applicantId of currentSelectedPosting.applicants) {
          if (applicantId === currentUserState.userId) {
            setIsApplied(true);
            break;
          }
        }
        const currentApplicant = await axios.get(
          `http://localhost:3000/api/applicants/${currentUserState.userId}`
        );
        for (const application of currentApplicant.data.applied) {
          if (
            application &&
            application.applicantStatus &&
            application.postingId === currentSelectedPosting._id
          ) {
            setApplicationStatus(application.applicantStatus);
            break;
          }
        }
      } else if (
        currentUserState.role === 'employer' &&
        currentSelectedPosting &&
        currentSelectedPosting.applicants &&
        currentSelectedPosting.applicants.length !== 0
      ) {
        const applicantList = [];
        for (const applicantId of currentSelectedPosting.applicants) {
          const applicant = await axios.get(
            `http://localhost:3000/api/applicants/${applicantId}`
          );
          applicantList.push(applicant.data);
        }
        setCurrentApplicants(applicantList);
        console.log(applicantList);
      }
    }
    fetchData();
  }, [currentSelectedPosting, applicantStatuses]);

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
      const requestBody = {
        applicantId: currentUserState.userId,
        applicantStatus: 'In Progress',
      };
      const applicantWithAppliedPosting = await axios.post(
        `http://localhost:3000/api/postings/apply/${currentSelectedPosting._id}`,
        requestBody
      );
      setIsApplied(true);
    } catch (e) {
      alert(e);
    }
  };

  const handleChangeApplicantStatus = async (newStatus, currentApplicant) => {
    try {
      const requestBody = {
        postingId: currentSelectedPosting._id,
        applicantStatus: newStatus,
      };
      console.log(currentApplicant);
      const applicantWithUpdatedStatus = await axios.patch(
        `http://localhost:3000/api/applicants/${currentApplicant._id}/update-status`,
        requestBody
      );
      console.log(applicantWithUpdatedStatus.data);
    } catch (e) {
      alert(e);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEditing = async (editedPosting) => {
    // console.log(currentSelectedPosting._id);
    // console.log(editedPosting);
    try {
      const updatedPosting = await axios.patch(
        `http://localhost:3000/api/postings/${currentSelectedPosting._id}`,
        editedPosting
      );
      setCurrentSelectedPosting(updatedPosting.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving edited posting:', error);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <Box>
      {currentSelectedPosting._id !== undefined && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: 5,
            minHeight: 600,
            maxHeight: 650,
            minWidth: 500,
            maxWidth: 600,
            overflowY: 'auto',
            p: 2,
            ml: 10,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Typography sx={{ fontSize: 30 }}>
                {currentSelectedPosting && currentSelectedPosting.jobTitle}
              </Typography>
              {currentUserState && currentUserState.role === 'applicant' && (
                <Button
                  variant="contained"
                  disabled={isApplied}
                  onClick={handleApply}
                >
                  {isApplied ? 'Already Applied' : 'Apply'}
                </Button>
              )}
              {currentUserState &&
                currentUserState.role === 'employer' &&
                currentUserState.userId ===
                  currentSelectedPosting.employerId && (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                      }}
                    >
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeletePosting}
                      >
                        Delete
                      </Button>
                    </Box>
                    <Dialog
                      open={isEditing}
                      onClose={handleCancelEditing}
                      maxWidth="sm"
                      fullWidth
                    >
                      <DialogContent>
                        <Typography variant="h6">Edit Posting</Typography>
                        <EditPostingForm
                          currentSelectedPosting={currentSelectedPosting}
                          onSave={handleSaveEditing}
                          onCancel={handleCancelEditing}
                        />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
            </Box>

            <Typography sx={{ mb: 4 }}>
              {currentSelectedPosting && currentSelectedPosting.companyName} |{' '}
              {currentSelectedPosting && currentSelectedPosting.city},{' '}
              {currentSelectedPosting && currentSelectedPosting.state} |{' '}
              {currentSelectedPosting &&
              currentSelectedPosting.applicants &&
              currentSelectedPosting.applicants.length === 1
                ? `${currentSelectedPosting.applicants.length} applicant`
                : `${currentSelectedPosting.applicants.length} applicants`}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: 24 }}>About</Typography>
                <Typography sx={{ textAlign: 'left' }}>
                  {currentSelectedPosting.description}
                </Typography>
              </Box>
              {currentUserState &&
                currentUserState.role === 'employer' &&
                currentSelectedPosting.employerId ===
                  currentUserState.userId && (
                  <Box>
                    <Typography sx={{ fontSize: 24 }}>Applicants</Typography>
                    <List
                      dense
                      sx={{
                        minWidth: 500,
                        bgcolor: 'background.paper',
                      }}
                    >
                      {currentSelectedPosting &&
                      currentSelectedPosting.applicants &&
                      currentSelectedPosting.applicants.length !== 0 &&
                      currentApplicants &&
                      currentApplicants.length !== 0 ? (
                        currentApplicants.map((applicant, index) => (
                          <ListItem
                            key={applicant._id}
                            disablePadding
                            sx={{ width: '100%' }}
                          >
                            <ListItemButton>
                              <ListItemAvatar>
                                <Avatar src="/async.png" />
                              </ListItemAvatar>
                              <ListItemText
                                id={applicant._id}
                                primary={applicant.name}
                              />
                              <Typography>Resume somewhere here</Typography>
                              <FormControl sx={{ width: '30%' }}>
                                <InputLabel
                                  id={`applicant-status-label-${index}`}
                                >
                                  Status
                                </InputLabel>
                                <Select
                                  labelId={`applicant-status-label-${index}`}
                                  id={`applicant-status-${index}`}
                                  value={
                                    applicantStatuses[applicant._id] ||
                                    'In Progress'
                                  }
                                  onChange={(e) => {
                                    setApplicantStatuses((prevStatuses) => ({
                                      ...prevStatuses,
                                      [applicant._id]: e.target.value,
                                    }));
                                    handleChangeApplicantStatus(
                                      e.target.value,
                                      applicant
                                    );
                                  }}
                                  label="Status"
                                >
                                  <MenuItem value={`In Progress`}>
                                    In Progress
                                  </MenuItem>
                                  <MenuItem value={`Accepted`}>Accept</MenuItem>
                                  <MenuItem value={`Rejected`}>Reject</MenuItem>
                                </Select>
                              </FormControl>
                            </ListItemButton>
                          </ListItem>
                        ))
                      ) : (
                        <Typography>No applicants yet!</Typography>
                      )}
                    </List>
                  </Box>
                )}

              {currentUserState &&
                currentUserState.role === 'applicant' &&
                currentSelectedPosting.applicants.includes(
                  currentUserState.userId
                ) && (
                  <Box>
                    {applicationStatus && (
                      <Typography sx={{ fontSize: 24, mt: 5 }}>
                        Application Status: {applicationStatus}
                      </Typography>
                    )}
                  </Box>
                )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PostingDetailsModal;
