import { Box, Typography, TextField, Stack, Button, Container } from "@mui/material";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";

const Register = () => {
  const { currentUser } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    console.log(displayName, email, password, confirmPassword);
    // const [displayName, email, password, confirmPassword] = e.target.elements;

    // Check that passwords match
    if (password !== confirmPassword) {
      setPasswordMatch('Passwords do not match');
      return false;
    } else {
      setPasswordMatch('');
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email,
        password,
        displayName
      );
    } catch (e) {
      alert(e);
    }
  };

  // Logged-in user cannot register
  if (currentUser) {
    // console.log(currentUser);
    // console.log("User logged in");
    return <Navigate to="/" replace={true}/>;
  }

  return (
    <div>
      <Navbar/>
      <Box>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Register
          </Typography>

        <form onSubmit={handleRegistration} action={<Link to="/login"/>}>
          <TextField 
            type="text" 
            label="Name" 
            color="secondary" 
            onChange={e => setDisplayName(e.target.value)} 
            fullWidth required sx={{mb:4}}
          />
          <TextField 
            type="email" 
            label="Email" 
            color="secondary" 
            onChange={e => setEmail(e.target.value)}
            fullWidth required sx={{mb:4}}
          />
          <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
            <TextField 
              type="text" 
              label="Password" 
              color="secondary" 
              onChange={e => setPassword(e.target.value)}
              fullWidth required sx={{mb:4}}
            />
            <TextField 
              type="text" 
              label="Confirm Password" 
              color="secondary" 
              onChange={e => setConfirmPassword(e.target.value)}
              fullWidth required sx={{mb:4}}
            />
          </Stack>
      
          <Button type="submit">Register</Button>
        </form>

      </Box>

      <br></br>

      <small>Already have an account? <Link to="/login">Login</Link></small>
    </div>
  );
};

export default Register;
