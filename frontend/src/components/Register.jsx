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
  const [birthDate, setBirthDate] = useState("");
  const [industry, setIndustry] = useState("");

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
      await axios.post("http://localhost:3000/api/register", {
        displayName: displayName,
        email: email,
        userRole: userType,
        state: state,
        city: city,
      });
      dispatch(setUser(displayName, email, userType));
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

  const stateAbbreviations = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  return (
    <div>
      <Navbar />
      <Box sx={{ maxWidth: "500px" }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Register
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

          <Stack spacing={3} direction="row" sx={{ marginBottom: 4 }}>
            <FormControl sx={{ width: "50%" }}>
              <InputLabel id="user-role-label">Role *</InputLabel>
              <Select
                labelId="user-role-label"
                id="user-role"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                label="Role"
                required
              >
                <MenuItem value="applicant">Applicant</MenuItem>
                <MenuItem value="employer">Employer</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "50%" }}>
              <InputLabel id="user-state-label">State *</InputLabel>
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
              sx={{ mb: 4 }}
            />
          </Stack>
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
          <Stack
            spacing={2}
            direction="row"
            sx={{ marginBottom: 4, marginTop: 4 }}
          >
            <TextField
              type="password"
              label="Password"
              color="secondary"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
            <TextField
              type="password"
              label="Confirm Password"
              color="secondary"
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
          </Stack>
          {/* <TextField
            type="text"
            label="Industry"
            color="secondary"
            onChange={(e) => setIndustry(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          /> */}
          <Button type="submit">Register</Button>
        </form>
      </Box>

      <br></br>

      <small>
        Already have an account? <Link to="/login">Login</Link>
      </small>
    </div>
  );
};

export default Register;
