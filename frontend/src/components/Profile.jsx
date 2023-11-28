import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import { updateProfile } from 'firebase/auth';
import ChangePassword from './ChangePassword';

import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
  });
  const [edit, setEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUserData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSaveClick = async () => {
    try {
      await updateProfile(currentUser, {
      displayName: userData.displayName,
      email: userData.email
    });
      setEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const showPasswordForm = () => {
    setShowChangePassword(true);
  };

  const hidePasswordForm = () => {
    setShowChangePassword(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Navbar />
      <h2>User Profile</h2>
      {edit ? (
        <>
          <label>
            Display Name:
            <input
              type="text"
              name="displayName"
              value={userData.displayName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled
            />
          </label>
          <br />
          <button onClick={handleSaveClick}>Save</button>
        </>
        
      ) : (
        <>
          <p>
            <strong>Display Name:</strong> {userData.displayName}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <button onClick={handleEditClick}>Edit</button>
        </>
      )}
      <div style={{ marginTop: '50px' }}>
        <button onClick={showPasswordForm}>Change Password</button>
        {showChangePassword && (
        <ChangePassword hideForm={hidePasswordForm} />
        )}
      </div>
    </>
  );
};

export default Profile;
