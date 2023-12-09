import React, { useState, useContext } from "react";
import { doChangePassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, TextField, Typography } from "@mui/material";

const ChangePassword = ({ hideForm }) => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const [pwMatch, setPwMatch] = useState("");

  const handleConfirm = async (event) => {
    event.preventDefault();
    const { currentPassword, newPasswordOne, newPasswordTwo } =
      event.target.elements;

    if (newPasswordOne.value !== newPasswordTwo.value) {
      setPwMatch("New passwords do not match");
      return false;
    }

    try {
      await doChangePassword(
        currentUser.email,
        currentPassword.value,
        newPasswordOne.value
      );
      alert("Password changed successfully");
      hideForm();
    } catch (error) {
      if (error.code === "auth/invalid-login-credentials") {
        alert("Current password is incorrect");
      } else {
        alert(error);
      }
    }
  };

  if (currentUser.providerData[0].providerId === "password") {
    return (
      <Box>
        {pwMatch && (
          <Typography variant="h4" color="error">
            {pwMatch}
          </Typography>
        )}
        <Typography variant="h5" sx={{ mb: 4 }}>
          Change Your Password Below
        </Typography>
        <form onSubmit={handleConfirm}>
          <Box className="form-group">
            <TextField
              label="Current Password"
              name="currentPassword"
              id="currentPassword"
              type="password"
              placeholder="Current Password"
              autoComplete="off"
              required
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>
          <Box className="form-group">
            <TextField
              label="New Password"
              name="newPasswordOne"
              id="newPasswordOne"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>
          <Box className="form-group">
            <TextField
              label="Confirm New Password"
              name="newPasswordTwo"
              id="newPasswordTwo"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required
              fullWidth
              sx={{ mb: 2 }}
            />
          </Box>
          <Box sx={{ mb: 3, mt: 2 }}>
            <Button variant="contained" type="submit" sx={{ mr: 2 }}>
              Confirm
            </Button>
            <Button variant="outlined" onClick={hideForm}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    );
  } else {
    return <Box></Box>;
  }
};

export default ChangePassword;
