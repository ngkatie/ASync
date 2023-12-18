import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Container,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { useDispatch } from "react-redux";
import { setUser } from "../actions";
import axios from "axios";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import stateAbbreviations from "../utils/stateAbbreviations";

const Register = () => {
  const { currentUser } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");
  const [userType, setUserType] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  // const [birthDate, setBirthDate] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyName, setCompanyName] = useState("");

  const dispatch = useDispatch();

  const handleRegistration = async (e) => {
    e.preventDefault();
    console.log(displayName, email, password, confirmPassword);
    // const [displayName, email, password, confirmPassword] = e.target.elements;

    // Check that passwords match
    if (password !== confirmPassword) {
      setPasswordMatch("Passwords do not match");
      return false;
    } else {
      setPasswordMatch("");
    }

    try {
      await doCreateUserWithEmailAndPassword(email, password, displayName);
      const requestBody = {
        displayName: displayName,
        email: email,
        companyName: companyName,
        userRole: userType,
        state: state,
        city: city,
        industry: industry,
      };
      let user = await axios.post(
        "http://localhost:3000/api/register",
        requestBody
      );
      user = user.data;
      dispatch(
        setUser(
          user._id,
          displayName,
          email,
          companyName,
          userType,
          state,
          city,
          industry
        )
      );
    } catch (e) {
      alert(e);
    }
  };

  // Logged-in user cannot register
  if (currentUser) {
    // console.log(currentUser);
    // console.log("User logged in");
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div>
      <Navbar />
      <Box sx={{ maxWidth: "500px", marginTop: 10, color: "black" }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Create an account
        </Typography>

        <form onSubmit={handleRegistration} action={<Link to="/login" />}>
          <TextField
            type="text"
            label="Name"
            color="secondary"
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type="email"
            label="Email"
            color="secondary"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <FormControl fullWidth required>
            <InputLabel id="user-role-label">Role</InputLabel>
            <Select
              labelId="user-role-label"
              id="user-role"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              label="Role"
              required
              sx={{ mb: 4 }}
              >
              <MenuItem value="applicant">Applicant</MenuItem>
              <MenuItem value="employer">Employer</MenuItem>
            </Select>
          </FormControl>
          <Stack spacing={3} direction="row" sx={{ marginBottom: 4 }}>
            <FormControl sx={{ width: "50%" }} required>
              <InputLabel id="user-state-label">State</InputLabel>
              <Select
                labelId="user-state-label"
                id="user-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
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
              type="text"
              label="City"
              color="secondary"
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              required
            />
          </Stack>
          {userType === "employer" ? (
            <TextField
              type="text"
              label="Company Name"
              color="secondary"
              onChange={(e) => setCompanyName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
          ) : null}
          {/* birth date input */}
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Date of birth"
                value={birthDate}
                onChange={(newValue) => {
                  setBirthDate(newValue);
                  console.log(newValue);
                }}
              />
            </DemoContainer>
          </LocalizationProvider> */}
          <TextField
            type="text"
            label="Industry"
            color="secondary"
            onChange={(e) => setIndustry(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
            <TextField
              type="password"
              label="Password"
              color="secondary"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <TextField
              type="password"
              label="Confirm Password"
              color="secondary"
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />
          </Stack>
          <Button type="submit" sx={{ fontSize: 24 }}>
            Register
          </Button>
        </form>
      </Box>
      <Typography sx={{ fontSize: 14 }}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </div>
  );
};

export default Register;
