import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { updateProfile } from "firebase/auth";
import ChangePassword from "./ChangePassword";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { setUser, unsetUser } from "../actions";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const dispatch = useDispatch();
  const currentUserState = useSelector((state) => state.user);
  console.log(currentUserState);

  useEffect(() => {
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
    }
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
      const { userId, ...userDataWithoutId } = userData;
      await axios.put(
        `http://localhost:3000/api/update-profile/${userData.userId}`,
        userDataWithoutId
      );
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

  return (
    <>
      <Navbar />
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Profile
        </Typography>
        {edit ? (
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
        ) : (
          <>
            <Typography>Name: {userData.name}</Typography>
            <Typography>Email: {userData.email}</Typography>
            {userData && userData.role === "employer" && (
              <Typography>Company: {userData.companyName}</Typography>
            )}
            <Typography>
              Location: {userData.city}, {userData.state}
            </Typography>
            <Typography>Industry: {userData.industry}</Typography>
            <Button
              variant="outlined"
              onClick={handleEditClick}
              sx={{ mt: 2, mb: 2 }}
            >
              Edit
            </Button>
          </>
        )}
      </Box>
      <Box>
        <Button variant="outlined" onClick={showPasswordForm} sx={{ mb: 2 }}>
          Change Password
        </Button>
        {showChangePassword && <ChangePassword hideForm={hidePasswordForm} />}
      </Box>
      <Link to="/" onClick={handleSignOut}>
        Log Out
      </Link>
    </>
  );
};

export default Profile;
