import React, { useState, useEffect, useContext, useCallback } from 'react';
import Navbar from './Navbar';
import { updateProfile } from 'firebase/auth';
import ChangePassword from './ChangePassword';
import UploadImageModal from './UploadImageModal';
import UploadResumeModal from './UploadResumeModal';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { setUser, unsetUser } from '../actions';
import {
  Box,
  Button,
  Tab,
  Tabs,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import PostingCard from './PostingCard';
import PostingDetailsModal from './PostingDetailsModal';
import stateAbbreviations from '../utils/stateAbbreviations';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ minHeight: '700px' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditCredentials, setShowEditCredentials] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [tab, setTab] = useState(0);
  const [postings, setPostings] = useState([]);
  const [currentSelectedPostingId, setCurrentSelectedPostingId] = useState('');
  const [currentSelectedPosting, setCurrentSelectedPosting] = useState({});
  const [appliedCompanies, setAppliedCompanies] = useState([]);
  const [appliedStatuses, setAppliedStatuses] = useState([]);

  const dispatch = useDispatch();
  const currentUserState = useSelector((state) => state.user);
  // console.log(currentUserState);

  useEffect(() => {
    async function fetchData() {
      if (currentUserState) {
        setUserData({
          userId: currentUserState.userId,
          name: currentUserState.name,
          email: currentUserState.email,
          companyName: currentUserState.companyName,
          role: currentUserState.role,
          state: currentUserState.state,
          city: currentUserState.city,
          industry: currentUserState.industry,
          photoURL: currentUser.photoURL,
        });
        if (currentUserState.role === 'employer') {
          const postingList = await axios.get(
            `http://3.23.52.34:3000/api/employers/${currentUserState.userId}/postings`
          );
          console.log(postingList.data);
          setPostings(postingList.data);
          if (postingList.data.length !== 0) {
            setCurrentSelectedPostingId(postingList.data[0]._id);
          }
        } else if (currentUserState.role === 'applicant') {
          const appliedCompaniesList = await axios.get(
            `http://3.23.52.34:3000/api/applicants/${currentUserState.userId}/applied-companies`
          );
          setAppliedCompanies(appliedCompaniesList.data);
        }
      }
    }
    fetchData();
  }, [currentUserState, tab]);

  useEffect(() => {
    async function fetchData() {
      console.log(postings);
      try {
        if (postings && postings.length !== 0) {
          let posting = await axios.get(
            `http://3.23.52.34:3000/api/postings/${currentSelectedPostingId}`
          );
          setCurrentSelectedPosting(posting.data);
          console.log(posting.data);
        }
      } catch (e) {
        alert(e);
      }
    }
    fetchData();
  }, [currentSelectedPostingId]);

  useEffect(() => {
    async function getStatuses() {
      console.log(currentUserState);
      if (currentUserState && currentUserState.role === 'applicant') {
        let applicant = await axios.get(
          `http://3.23.52.34:3000/api/applicants/${currentUserState.userId}`
        );
        console.log(applicant);
        const { data } = applicant;
        setAppliedStatuses(data.applied);
      }
    }
    getStatuses();
  }, []);

  const findStatus = (postingId) => {
    const appInfo = appliedStatuses.filter(
      (post) => post.postingId == postingId
    );
    const status = appInfo[0]?.applicantStatus;
    // console.log(appInfo[0]);
    return status;
  };

  const handleSignOut = () => {
    doSignOut();
    dispatch(unsetUser());
  };

  const handleEditClick = () => {
    setEdit(() => !edit);
  };

  const handleCancelEditClick = () => {
    setEdit(() => !edit);
  };

  const handleSaveClick = async () => {
    try {
      //update context api
      await updateProfile(currentUser, {
        displayName: userData.name,
        email: userData.email,
      });
      //update mongodb
      let userDataWithoutId = {};
      if (currentUserState.role === 'employer') {
        const { userId, companyName, ...employerData } = userData;
        userDataWithoutId = {
          companyName,
          role: employerData.role,
          state: employerData.state,
          city: employerData.city,
          industry: employerData.industry,
        };
        await axios.put(
          `http://3.23.52.34:3000/api/update-profile/${userData.userId}`,
          userDataWithoutId
        );
      } else {
        const { userId, ...applicantData } = userData;
        userDataWithoutId = {
          name: applicantData.name,
          role: applicantData.role,
          state: applicantData.state,
          city: applicantData.city,
          industry: applicantData.industry,
        };

        // console.log(userDataWithoutId);
        // console.log(userData);
        await axios.put(
          `http://3.23.52.34:3000/api/update-profile/${userData.userId}`,
          userDataWithoutId
        );
      }

      //update redux state
      dispatch(
        setUser(
          userData.userId,
          userData.name,
          userData.email,
          userData.companyName,
          userData.role,
          userData.state,
          userData.city,
          userData.industry
        )
      );
      setEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const showPasswordForm = () => {
    setShowChangePassword(true);
  };

  const hidePasswordForm = () => {
    setShowChangePassword(false);
  };

  const showUploadImageForm = () => {
    setShowUploadImage(true);
  };

  const hideUploadPhotoForm = () => {
    setShowUploadImage(false);
  };

  const showUploadResumeForm = () => {
    setShowUploadResume(true);
  };

  const hideUploadResumeForm = () => {
    setShowUploadResume(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          backgroundColor: 'rgb(200,200,200, 0.3)',
          padding: '10px',
          borderRadius: 5,
          p: 2,
          mt: 11,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="About" />
            {userData && userData.role === 'employer' ? (
              <Tab label="Postings" />
            ) : (
              <Tab label="Applied Companies" />
            )}
            <Tab label="Settings" />
          </Tabs>
        </Box>

        <TabPanel value={tab} index={0}>
          <Box sx={{ textAlign: 'left' }}>
            {userData.photoURL ? (
              <img src={userData.photoURL} width="200" />
            ) : (
              ''
            )}
            <Typography sx={{ fontSize: 30 }}>{userData.name}</Typography>
            <Typography>{userData.email}</Typography>
            {userData && userData.role === 'employer' && (
              <Typography>{userData.companyName}</Typography>
            )}
            <Typography>
              {userData.city}, {userData.state}
            </Typography>
            <Typography>Industry: {userData.industry}</Typography>
          </Box>
        </TabPanel>

        {userData && userData.role === 'employer' && (
          <TabPanel value={tab} index={1}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black',
                }}
              >
                {postings && postings.length !== 0 ? (
                  postings.map((posting) => (
                    <PostingCard
                      key={posting._id}
                      userRole={userData.role}
                      postingId={posting._id}
                      jobTitle={posting.jobTitle}
                      companyName={posting.companyName}
                      companyLogo={posting.companyLogo}
                      jobType={posting.jobType}
                      numOfEmployees={posting.numOfEmployees}
                      description={posting.description}
                      pay={posting.pay}
                      rate={posting.rate}
                      applicants={posting.applicants}
                      skills={posting.skills}
                      city={posting.city}
                      state={posting.state}
                      setCurrentSelectedPostingId={setCurrentSelectedPostingId}
                    />
                  ))
                ) : (
                  <Typography>No postings made yet!</Typography>
                )}
              </Box>
              {currentSelectedPostingId && currentSelectedPosting && (
                <PostingDetailsModal
                  currentSelectedPosting={currentSelectedPosting}
                  currentUserState={currentUserState}
                  setPostings={setPostings}
                  setCurrentSelectedPosting={setCurrentSelectedPosting}
                />
              )}
            </Box>
          </TabPanel>
        )}

        {userData && userData.role === 'applicant' && (
          <TabPanel value={tab} index={1}>
            <Box>
              {appliedCompanies && appliedCompanies.length !== 0 ? (
                appliedCompanies.map((posting) => (
                  <PostingCard
                    key={posting._id}
                    userRole={userData.role}
                    postingId={posting._id}
                    jobTitle={posting.jobTitle}
                    companyName={posting.companyName}
                    companyLogo={posting.companyLogo}
                    jobType={posting.jobType}
                    numOfEmployees={posting.numOfEmployees}
                    description={posting.description}
                    pay={posting.pay}
                    rate={posting.rate}
                    applicants={posting.applicants}
                    skills={posting.skills}
                    city={posting.city}
                    state={posting.state}
                    postedDate={posting.postedDate}
                    status={findStatus(posting._id)}
                    setCurrentSelectedPostingId={setCurrentSelectedPostingId}
                  />
                ))
              ) : (
                <Typography>No companies you've applied to yet!</Typography>
              )}
            </Box>
          </TabPanel>
        )}

        <TabPanel value={tab} index={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'black',
            }}
          >
            {edit && (
              <>
                <TextField
                  label="Name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="City"
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel id="user-state-label">State</InputLabel>
                  <Select
                    labelId="user-state-label"
                    id="user-state"
                    name="state"
                    value={userData.state}
                    onChange={handleChange}
                    label="State"
                    required
                  >
                    {stateAbbreviations.map((abbreviation) => (
                      <MenuItem key={abbreviation} value={abbreviation}>
                        {abbreviation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Industry"
                  name="industry"
                  value={userData.industry}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <Button
                  variant="contained"
                  onClick={handleSaveClick}
                  sx={{ mb: 2 }}
                >
                  Save
                </Button>
                <Button onClick={handleCancelEditClick} sx={{ mb: 2 }}>
                  Cancel
                </Button>
              </>
            )}

            <Button
              variant="outlined"
              onClick={handleEditClick}
              sx={{ mt: 2, mb: 2 }}
            >
              Edit profile details
            </Button>

            <Button
              variant="outlined"
              onClick={showUploadImageForm}
              sx={{ mb: 2 }}
            >
              {currentUserState.role === 'employer'
                ? 'Update company logo'
                : 'Update profile photo'}
            </Button>
            {showUploadImage && (
              <UploadImageModal hideForm={hideUploadPhotoForm} />
            )}
            {currentUserState.role === 'applicant' ? (
              <Button
                variant="outlined"
                onClick={showUploadResumeForm}
                sx={{ mb: 2 }}
              >
                Update resume
              </Button>
            ) : null}
            {showUploadResume && (
              <UploadResumeModal hideForm={hideUploadResumeForm} />
            )}

            <Button
              variant="outlined"
              onClick={showPasswordForm}
              sx={{ mb: 2 }}
            >
              Change Password
            </Button>
            {showChangePassword && (
              <ChangePassword hideForm={hidePasswordForm} />
            )}

            <Link to="/" onClick={handleSignOut}>
              Log out
            </Link>
          </Box>
        </TabPanel>
      </Box>
    </>
  );
};

export default Profile;
