import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storage } from "../main"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { AuthContext } from '../context/AuthContext';
import { getAuth, updateProfile } from "firebase/auth";
import axios from 'axios';
import { Box, Stack, Button, TextField } from '@mui/material';

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
        console.log(currentUser);
        const imageRef = ref(storage, `images/${currentUser.uid}`);
        console.log(imageRef);
        uploadBytes(imageRef, image).then((snapshot) => {
            getDownloadURL(imageRef)
                .then((url)=> {
                    setImageUrl(url);
                    const auth = getAuth();
                    updateProfile(auth.currentUser, {
                        photoURL: url
                    })
                })
            // console.log(currentUser);
        })
        try {
            const requestBody = {
                photoUrl: imageUrl
            };
            console.log(requestBody);
            await axios.put(
                `http://localhost:3000/api/update-photo/${currentUserState.userId}`,
                requestBody
            );
        } catch (e) {
            console.log(e);
        }
        alert("Image uploaded");
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