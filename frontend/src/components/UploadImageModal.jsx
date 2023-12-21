import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    async function uploadImage() {
        if (image == null) {
            return;
        }

        let imageRef = ref(storage, `images/${currentUser.uid}`);
        try {
            const snapshot = await uploadBytes(imageRef, image);
            const url = await getDownloadURL(imageRef);

            console.log(image);
            // Update user profile
            const auth = getAuth();
            await updateProfile(auth.currentUser, {
                photoURL: url,
            });

            // Send request to update photo URL on the server
            let requestBody = {
                userType: currentUserState.role,
                photoUrl: url,
            };

            const updated = await axios.put(
                `http://localhost:3000/api/update-photo/${currentUserState.userId}`,
                requestBody
            );

            console.log(updated);


            // NEEDS FIXING =========================================
            //get editted photo from backend
            console.log("WE GET FILE !!!")
            const edittedImage = await axios.get(
                `http://localhost:3000/api/photo/${currentUserState.userId}`, { responseType: 'arraybuffer' }
            );
            const imageData = edittedImage.data;

            const blob = new Blob([imageData], { type: 'image/jpeg' }); 
            const file = new File([blob], 'editedImage.jpg', { type: 'image/jpeg' }); // Adjust the filename and type accordingly
            
            //upload photo to firebase
            const snapshot2 = await uploadBytes(imageRef, file);
            const url2 = await getDownloadURL(imageRef);
            await updateProfile(auth.currentUser, {
                photoURL: url2,
            });
            console.log("URL2: ", url2)

            //update Mongo
            requestBody = {
                userType: currentUserState.role,
                photoUrl: url2,
            };
            const mongoUpdate = await axios.put(
                `http://localhost:3000/api/mongo-update/${currentUserState.userId}`,
                requestBody
            )

            //delete photo from backend
            // const deleted = await axios.delete(
            //     `http://localhost:3000/api/photo/${currentUserState.userId}`
            // );

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