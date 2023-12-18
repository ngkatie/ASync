import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import stateAbbreviations from '../utils/stateAbbreviations';

const EditPostingForm = ({ currentSelectedPosting, onSave, onCancel }) => {
  const [editedPosting, setEditedPosting] = useState({
    jobTitle: currentSelectedPosting.jobTitle,
    companyName: currentSelectedPosting.companyName,
    jobType: currentSelectedPosting.jobType,
    numOfEmployees: currentSelectedPosting.numOfEmployees,
    description: currentSelectedPosting.description,
    pay: currentSelectedPosting.pay,
    rate: currentSelectedPosting.rate,
    skills: currentSelectedPosting.skills,
    city: currentSelectedPosting.city,
    state: currentSelectedPosting.state,
  });

  useEffect(() => {
    setEditedPosting({
      jobTitle: currentSelectedPosting.jobTitle,
      companyName: currentSelectedPosting.companyName,
      jobType: currentSelectedPosting.jobType,
      numOfEmployees: currentSelectedPosting.numOfEmployees,
      description: currentSelectedPosting.description,
      pay: currentSelectedPosting.pay,
      rate: currentSelectedPosting.rate,
      skills: currentSelectedPosting.skills,
      city: currentSelectedPosting.city,
      state: currentSelectedPosting.state,
    });
  }, [currentSelectedPosting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPosting((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    onSave(editedPosting);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  return (
    <Box>
      <TextField
        type="text"
        label="Job Title"
        color="secondary"
        value={editedPosting.jobTitle}
        onChange={handleInputChange}
        // disabled
        fullWidth
        required
        sx={{ mb: 4 }}
        name="jobTitle"
      />
      <TextField
        type="text"
        label="Company Name"
        color="secondary"
        value={editedPosting.companyName}
        onChange={handleInputChange}
        // disabled
        fullWidth
        required
        sx={{ mb: 4 }}
        name="companyName"
      />
      <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
        <FormControl sx={{ width: '50%' }}>
          <InputLabel id="job-type-label">Job Type *</InputLabel>
          <Select
            labelId="job-type-label"
            id="job-type"
            name="jobType"
            value={editedPosting.jobType}
            onChange={handleInputChange}
            label="job-type"
            required
          >
            <MenuItem value="full-time">Full-Time</MenuItem>
            <MenuItem value="part-time">Part-Time</MenuItem>
            <MenuItem value="internship">Internship</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ width: '50%' }}>
          <InputLabel id="num-employees-label">Num. Employees *</InputLabel>
          <Select
            labelId="num-employees-label"
            id="num-employees"
            name="numOfEmployees"
            value={editedPosting.numOfEmployees}
            onChange={handleInputChange}
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
        value={editedPosting.description}
        onChange={handleInputChange}
        fullWidth
        required
        multiline
        rows={10}
        sx={{ mb: 4 }}
        name="description"
      />
      <TextField
        type="text"
        label="Skills"
        color="secondary"
        value={editedPosting.skills}
        onChange={handleInputChange}
        fullWidth
        required
        sx={{ mb: 4 }}
        name="skills"
      />
      <Stack spacing={4} direction="row" sx={{ marginBottom: 4 }}>
        <TextField
          type="text"
          label="Pay"
          color="secondary"
          value={editedPosting.pay}
          onChange={handleInputChange}
          sx={{ width: '30%' }}
          required
          name="pay"
        />
        <FormControl>
          <FormLabel id="rate">Rate *</FormLabel>
          <RadioGroup
            row
            aria-labelledby="rate"
            name="rate"
            value={editedPosting.rate}
            onChange={handleInputChange}
          >
            <FormControlLabel value="hr" control={<Radio />} label="Hourly" />
            <FormControlLabel value="mo" control={<Radio />} label="Monthly" />
            <FormControlLabel value="yr" control={<Radio />} label="Yearly" />
          </RadioGroup>
        </FormControl>
      </Stack>
      <Stack spacing={4} direction="row" sx={{ marginBottom: 4 }}>
        <FormControl sx={{ width: '50%' }}>
          <InputLabel id="user-state-label">State *</InputLabel>
          <Select
            labelId="user-state-label"
            id="user-state"
            name="state"
            value={editedPosting.state}
            onChange={handleInputChange}
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
          value={editedPosting.city}
          onChange={handleInputChange}
          fullWidth
          required
          name="city"
        />
      </Stack>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSaveClick}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleCancelClick}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditPostingForm;
