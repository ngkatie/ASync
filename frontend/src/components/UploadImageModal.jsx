import React, { useState, useContext } from 'react';
import { storage } from "../main"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { AuthContext } from '../context/AuthContext';
import { getAuth, updateProfile } from "firebase/auth";
import { Box, Stack, Button, TextField } from '@mui/material';

const UploadImageModal = ({ hideForm }) => {
    const { currentUser } = useContext(AuthContext);
    const [image, setImage] = useState(null);

    function uploadImage() {
        if (image == null) {
            return;
        }
        console.log(currentUser);
        const imageRef = ref(storage, `images/${currentUser.uid}`);
        console.log(imageRef);
        uploadBytes(imageRef, image).then((snapshot) => {
            getDownloadURL(imageRef)
                .then((url)=> {
                    const auth = getAuth();
                    updateProfile(auth.currentUser, {
                        photoURL: url
                    })
                })
            console.log(currentUser);
            alert("Image uploaded");
        })
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