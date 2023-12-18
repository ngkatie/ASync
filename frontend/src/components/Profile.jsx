import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import { updateProfile } from 'firebase/auth';
import ChangePassword from './ChangePassword';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { setUser, unsetUser } from '../actions';
import { Box, Button, Tab, Tabs, TextField, Typography } from '@mui/material';
import axios from 'axios';
import PostingCard from './PostingCard';
import PostingDetailsModal from './PostingDetailsModal';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [tab, setTab] = useState(0);
  const [postings, setPostings] = useState([]);
  const [currentSelectedPostingId, setCurrentSelectedPostingId] = useState('');
  const [currentSelectedPosting, setCurrentSelectedPosting] = useState({});
  const [appliedCompanies, setAppliedCompanies] = useState([]);
  const [appliedStatuses, setAppliedStatuses] = useState([]);

  const dispatch = useDispatch();
  const currentUserState = useSelector((state) => state.user);
  console.log(currentUserState);

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
        });
        if (currentUserState.role === 'employer') {
          const postingList = await axios.get(
            `http://localhost:3000/api/employers/${currentUserState.userId}/postings`
          );
          console.log(postingList.data);
          setPostings(postingList.data);
          if (postingList.data.length !== 0) {
            setCurrentSelectedPostingId(postingList.data[0]._id);
          }
        } else if (currentUserState.role === 'applicant') {
          const appliedCompaniesList = await axios.get(
            `http://localhost:3000/api/applicants/${currentUserState.userId}/applied-companies`
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
            `http://localhost:3000/api/postings/${currentSelectedPostingId}`
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

  const findStatus = async (postingId) => {
    console.log('REACHED');
    let applicant = await axios.get(
      `http://localhost:3000/api/applicants/${currentUserState.userId}`
    );
    const { data } = applicant;
    const appInfo = data.applied.filter((post) => post.postingId == postingId);
    return appInfo[0].applicantStatus;
  }

  const handleSignOut = () => {
    doSignOut();
    dispatch(unsetUser());
  };

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSaveClick = async () => {
    try {
      //update context api
      await updateProfile(currentUser, {
        displayName: userData.name,
        email: userData.email,
      });
      //update mongodb
      if (userData.companyName.length === 0) {
        let { userId, companyName, ...userDataWithoutId } = userData;
        await axios.put(
          `http://localhost:3000/api/update-profile/${userData.userId}`,
          userDataWithoutId
        );
      } else {
        let { userId, ...userDataWithoutId } = userData;
        await axios.put(
          `http://localhost:3000/api/update-profile/${userData.userId}`,
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

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role='tabpanel'
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
            <Tab label='About' />
            {userData && userData.role === 'employer' ? (
              <Tab label='Postings' />
            ) : (
              <Tab label='Applied Companies' />
            )}
            <Tab label='Settings' />
          </Tabs>
        </Box>

        <TabPanel value={tab} index={0}>
          <Box sx={{ textAlign: 'left' }}>
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
                  label='Name'
                  name='name'
                  value={userData.name}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 4 }}
                />
                <TextField
                  label='Email'
                  name='email'
                  value={userData.email}
                  onChange={handleChange}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <Button
                  variant='contained'
                  onClick={handleSaveClick}
                  sx={{ mb: 2 }}
                >
                  Save
                </Button>
              </>
            )}
            <Button
              variant='outlined'
              onClick={handleEditClick}
              sx={{ mt: 2, mb: 2 }}
            >
              Edit credentials
            </Button>
            <Button
              variant='outlined'
              onClick={showPasswordForm}
              sx={{ mb: 2 }}
            >
              Change Password
            </Button>
            {showChangePassword && (
              <ChangePassword hideForm={hidePasswordForm} />
            )}
            <Link to='/' onClick={handleSignOut}>
              Log out
            </Link>
          </Box>
        </TabPanel>
      </Box>
    </>
  );
};

export default Profile;
