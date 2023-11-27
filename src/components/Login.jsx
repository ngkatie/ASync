import React, { useState, useContext } from "react";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import { Box, Typography, TextField, Stack, Button, Container } from "@mui/material";
import { doSignInWithEmailAndPassword, doPasswordReset } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../context/AuthContext";
import { current } from "immer";

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async(e) => {
    e.preventDefault();

    try {
      await doSignInWithEmailAndPassword(email, password);
    } catch (e) {
      alert(e);
    }
  }

  if (currentUser) {
    return <Navigate to="/"/>;
  }

  return (
    <div>
      <Box>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Log In
        </Typography>

        <form onSubmit={handleLogIn} action={<Link to="/postings"/>}>
          <TextField 
            type="email" 
            label="Email" 
            color="secondary" 
            onChange={e => setEmail(e.target.value)}
            fullWidth required sx={{mb:4}}
          />
          <TextField 
            type="text" 
            label="Password" 
            color="secondary" 
            onChange={e => setPassword(e.target.value)}
            fullWidth required sx={{mb:4}}
          />

          <Button type="submit">Log In</Button>

          {/* <Button onClick={passwordReset}>
            Forgot Password
          </Button> */}
        </form>
      </Box>
    </div>
  )
};

export default Login;
