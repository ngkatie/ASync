import React, { useState, useContext } from 'react';
import { doChangePassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../context/AuthContext';

const ChangePassword = ({ hideForm }) => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const [pwMatch, setPwMatch] = useState('');

  const handleConfirm = async (event) => {
    event.preventDefault();
    const {currentPassword, newPasswordOne, newPasswordTwo} = event.target.elements

    if (newPasswordOne.value !== newPasswordTwo.value) {
        setPwMatch('New passwords do not match');
        return false;
    }

    try {
        await doChangePassword(currentUser.email, currentPassword.value, newPasswordOne.value);
        alert('Password changed successfully');
        hideForm();
    } catch (error) {
        if (error.code === 'auth/invalid-login-credentials') {
            alert('Current password is incorrect')
        } else {
            alert(error);
        }
    }
  }

  if (currentUser.providerData[0].providerId === 'password') {
    return (
      <div>
        {pwMatch && <h4 className='error'>{pwMatch}</h4>}
        <h2>Hi {currentUser.displayName}, Change Your Password Below</h2>
        <form onSubmit={handleConfirm}>
          <div className='form-group'>
            <label>
              Current Password:
              <input
                className='form-control'
                name='currentPassword'
                id='currentPassword'
                type='password'
                placeholder='Current Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <div className='form-group'>
            <label>
              New Password:
              <input
                className='form-control'
                name='newPasswordOne'
                id='newPasswordOne'
                type='password'
                placeholder='Password'
                autoComplete='off'
                required
              />
            </label>
          </div>
          <div className='form-group'>
            <label>
              Confirm New Password:
              <input
                className='form-control'
                name='newPasswordTwo'
                id='newPasswordTwo'
                type='password'
                placeholder='Confirm Password'
                autoComplete='off'
                required
              />
            </label>
          </div>

          <button className='button' type='submit'>
            Confirm
          </button>
          <button onClick={hideForm}>Cancel</button>
        </form>
        <br />
      </div>
    );
  } else {
    return (
      <div>
      </div>
    );
  }

};

export default ChangePassword;