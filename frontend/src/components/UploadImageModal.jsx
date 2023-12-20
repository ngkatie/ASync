import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storage } from "../main"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { AuthContext } from '../context/AuthContext';
import { getAuth, updateProfile } from "firebase/auth";
import axios from 'axios';
import { Box, Stack, Button, TextField } from '@mui/material';
import { current } from '@reduxjs/toolkit';

const UploadImageModal = ({ hideForm }) => {
    const { currentUser } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const dispatch = useDispatch();
    const currentUserState = useSelector((state) => state.user);

    async function uploadImage() {
    if (image == null) {
        return;
    }

    const imageRef = ref(storage, `images/${currentUser.uid}`);
    try {
        const snapshot = await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);

        // Update user profile
        const auth = getAuth();
        await updateProfile(auth.currentUser, {
            photoURL: url,
        });

        // Send request to update photo URL on the server
        const requestBody = {
            userType: currentUserState.role,
            photoUrl: url,
        };

        const updated = await axios.put(
            `http://localhost:3000/api/update-photo/${currentUserState.userId}`,
            requestBody
        );

        console.log(updated);
        alert("Image uploaded");
    } catch (e) {
        console.error(e);
    }
}

    return (
        <Box sx={{mb: 2}}>
            <TextField
                type="file"
                onChange={(e) => {
                    setImage(e.target.files[0]);
                }}
            />
            <Stack 
                spacing={2} 
                direction="row" 
                justifyContent="center" 
                sx={{margin: 1}}
            >
                <Button onClick={uploadImage}>
                    Upload Image
                </Button>
                <Button onClick={hideForm}>
                Cancel
                </Button>
            </Stack>
        </Box>
    )
}

export default UploadImageModal;