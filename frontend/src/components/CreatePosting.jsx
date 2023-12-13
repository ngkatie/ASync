import React, { useState } from "react";
import Navbar from "./Navbar";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import stateAbbreviations from "../utils/stateAbbreviations";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const CreatePosting = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [jobType, setJobType] = useState("");
  const [numOfEmployees, setNumOfEmployees] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [rate, setRate] = useState("");
  const [skills, setSkills] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postingId, setPostingId] = useState("");

  const currentUserState = useSelector((state) => state.user);

  if (currentUserState && currentUserState.role !== "employer") {
    return <Navigate to="/" replace={true} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        employerId: currentUserState.userId,
        jobTitle: jobTitle,
        companyName: companyName,
        companyLogo: companyLogo,
        jobType: jobType,
        numOfEmployees: numOfEmployees,
        description: description,
        pay: pay,
        rate: rate,
        skills: skills,
        city: city,
        state: state,
      };
      let posting = await axios.post(
        "http://localhost:3000/api/postings",
        requestBody
      );
      posting = posting.data;
      console.log(posting);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: "500px", marginTop: 20 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Create a posting
        </Typography>
        <form
          onSubmit={handleSubmit}
          action={<Link to={`/postings${postingId}`} />}
        >
          <TextField
            type="text"
            label="Job Title"
            color="secondary"
            onChange={(e) => setJobTitle(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type="text"
            label="Company Name"
            color="secondary"
            onChange={(e) => setCompanyName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          {/* company logo image input */}
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <FormControl sx={{ width: "50%" }}>
              <InputLabel id="job-type-label">Job Type *</InputLabel>
              <Select
                labelId="job-type-label"
                id="job-type"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                label="job-type"
                required
              >
                <MenuItem value="full-time">Full-Time</MenuItem>
                <MenuItem value="part-time">Part-Time</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "50%" }}>
              <InputLabel id="num-employees-label">Num. Employees *</InputLabel>
              <Select
                labelId="num-employees-label"
                id="num-employees"
                value={numOfEmployees}
                onChange={(e) => setNumOfEmployees(e.target.value)}
                label="num-employees"
                required
              >
                <MenuItem value="1-10">1-10</MenuItem>
                <MenuItem value="11-50">11-50</MenuItem>
                <MenuItem value="51-100">51-100</MenuItem>
                <MenuItem value="101-500">101-500</MenuItem>
                <MenuItem value="501-1,000">501-1,000</MenuItem>
                <MenuItem value="1,001-5,000">1,001-5,000</MenuItem>
                <MenuItem value="5,001-10,000">5,001-10,000</MenuItem>
                <MenuItem value="10,001+">10,001+</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <TextField
            type="text"
            label="Description"
            color="secondary"
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
            rows={10}
            sx={{ mb: 4 }}
          />
          <TextField
            type="text"
            label="Skills"
            color="secondary"
            onChange={(e) => setSkills(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <Stack spacing={4} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              label="Pay"
              color="secondary"
              onChange={(e) => setPay(e.target.value)}
              sx={{ width: "30%" }}
              required
            />
            <FormControl>
              <FormLabel id="rate">Rate *</FormLabel>
              <RadioGroup
                row
                aria-labelledby="rate"
                name="Rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              >
                <FormControlLabel
                  value="hr"
                  control={<Radio />}
                  label="Hourly"
                />
                <FormControlLabel
                  value="mo"
                  control={<Radio />}
                  label="Monthly"
                />
                <FormControlLabel
                  value="yr"
                  control={<Radio />}
                  label="Yearly"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
          <Stack spacing={4} direction="row" sx={{ marginBottom: 4 }}>
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
            />
          </Stack>
          <Button type="submit" variant="contained" sx={{ fontSize: 18 }}>
            Create
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CreatePosting;
