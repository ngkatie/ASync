import React, { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Container,
} from "@mui/material";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../actions";

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const currentUserState = useSelector((state) => state.user);

  useEffect(() => {
    console.log(currentUserState);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await doSignInWithEmailAndPassword(email, password);
      let applicants = await axios.get("http://localhost:3000/api/applicants");
      applicants = applicants.data;
      // const employers = await axios.get("http://localhost:3000/api/employers");

      for (const applicant of applicants) {
        if (applicant.email === email) {
          dispatch(setUser(applicant.name, email, "applicant"));
          console.log("successfully set role after logging in");
        }
      }

      // for (const employer of employers) {
      //   if (employer.email === email) {
      //     dispatch(setUser(employer.name, email, "employer"));
      //   }
      // }
    } catch (e) {
      alert(e);
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Navbar />
      <Box>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Log In
        </Typography>

        <form onSubmit={handleLogin} action={<Link to="/postings" />}>
          <TextField
            type="email"
            label="Email"
            color="secondary"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type="password"
            label="Password"
            color="secondary"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />

          <Button type="submit">Log In</Button>

          <br></br>

          <small>
            Don't have an account yet?{" "}
            <Link to="/register">Register here!</Link>
          </small>

          {/* <Button onClick={passwordReset}>
            Forgot Password
          </Button> */}
        </form>
      </Box>
    </div>
  );
};

export default Login;
