import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storage } from "../main";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthContext } from '../context/AuthContext';
import { getAuth, updateProfile } from "firebase/auth";
import axios from 'axios';
import { Box, Stack, Button, TextField } from '@mui/material';

const UploadResumeModal = ({ hideForm }) => {
    const { currentUser } = useContext(AuthContext);
    const [resume, setResume] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');

    const dispatch = useDispatch();
    const currentUserState = useSelector((state) => state.user);

    async function uploadResume() {
        if (resume == null) {
            return;
        }
        console.log('START HERE');
        console.log(currentUserState);
        const resumeRef = ref(storage, `resumes/${currentUser.uid}`);
        uploadBytes(resumeRef, resume).then((snapshot) => {
            getDownloadURL(resumeRef)
                .then((url)=> {
                    setResumeUrl(url);
                })
        })
        const requestBody = {
            resumeUrl: resumeUrl
        };

        try {
            await axios.put(
                `http://localhost:3000/api/update-resume/${currentUserState.userId}`,
                requestBody
            );
        } catch (e) {
            console.log(e);
        }
        alert("Resume uploaded");
    }

    return (
        <Box sx={{mb: 2}}>
            <TextField
                type="file"
                onChange={(e) => {
                    setResume(e.target.files[0]);
                }}
            />
            <Stack 
                spacing={2} 
                direction="row" 
                justifyContent="center" 
                sx={{margin: 1}}
            >
                <Button onClick={uploadResume}>
                    Upload Resume
                </Button>
                <Button onClick={hideForm}>
                Cancel
                </Button>
            </Stack>
        </Box>
    )
}

export default UploadResumeModal;