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
  TextareaAutosize,
} from "@mui/material";
import { styled } from "@mui/system";
import stateAbbreviations from "../utils/stateAbbreviations";

const CreatePosting = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [jobType, setJobType] = useState("");
  const [numOfEmployees, setNumOfEmployees] = useState("");
  const [description, setDescription] = useState("");
  const [payRate, setPayRate] = useState("");
  const [skills, setSkills] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: "500px", marginTop: 20 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Create a posting
        </Typography>
        <form>
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
          <Stack spacing={3} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              label="Pay Rate"
              color="secondary"
              onChange={(e) => setPayRate(e.target.value)}
              sx={{ width: "70%" }}
              required
            />
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
        </form>
      </Box>
    </>
  );
};

export default CreatePosting;
