import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { updateProfile } from "firebase/auth";
import ChangePassword from "./ChangePassword";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { setUser, unsetUser } from "../actions";
import { Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import axios from "axios";
import PostingCard from "./PostingCard";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [tab, setTab] = useState(0);
  const [employerPostings, setEmployerPostings] = useState([]);
  const [applicantAppliedCompanies, setApplicantAppliedCompanies] = useState(
    []
  );

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
        if (currentUserState.role === "employer") {
          const postings = await axios.get(
            `http://localhost:3000/api/employers/${currentUserState.userId}/postings`
          );
          setEmployerPostings(postings.data);
        }
        // else if (currentUserState.role === "applicant") {

        // }
      }
    }
    fetchData();
  }, [currentUserState]);

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
      console.error("Error updating profile:", error);
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
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        style={{ minHeight: "500px" }}
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
          width: "100%",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 20,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="About" />
            {userData && userData.role === "employer" ? (
              <Tab label="Postings" />
            ) : null}
            <Tab label="Settings" />
          </Tabs>
        </Box>

        <TabPanel value={tab} index={0}>
          <Typography>Name: {userData.name}</Typography>
          <Typography>Email: {userData.email}</Typography>
          {userData && userData.role === "employer" && (
            <Typography>Company: {userData.companyName}</Typography>
          )}
          <Typography>
            Location: {userData.city}, {userData.state}
          </Typography>
          <Typography>Industry: {userData.industry}</Typography>
        </TabPanel>

        {userData && userData.role === "employer" && (
          <TabPanel value={tab} index={1}>
            {employerPostings &&
              employerPostings.map((posting) => (
                <PostingCard
                  key={posting._id}
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
                />
              ))}
          </TabPanel>
        )}

        {userData && userData.role === "applicant" && (
          <TabPanel value={tab} index={1}>
            <Typography>Applied Companies</Typography>
          </TabPanel>
        )}

        <TabPanel value={tab} index={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
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
                  sx={{ mb: 4 }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleSaveClick}
                  sx={{ mb: 2 }}
                >
                  Save
                </Button>
              </>
            )}
            <Button
              variant="outlined"
              onClick={handleEditClick}
              sx={{ mt: 2, mb: 2 }}
            >
              Edit credentials
            </Button>
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
