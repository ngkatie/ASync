import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Container,
} from '@mui/material';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from '../firebase/FirebaseFunctions';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../actions';
import { validateEmail, validatePassword } from '../validation';

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const currentUserState = useSelector((state) => state.user);

  useEffect(() => {
    console.log(currentUserState);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!validateEmail(email) || !validatePassword(password)) {
        throw 'email or password must be strings or are too long';
      }
      await doSignInWithEmailAndPassword(email, password);
      let applicants = await axios.get('http://3.23.52.34:3000/api/applicants');
      console.log(applicants);
      applicants = applicants.data;
      for (const applicant of applicants) {
        if (applicant.email === email) {
          dispatch(
            setUser(
              applicant._id,
              applicant.name,
              email,
              null,
              'applicant',
              applicant.state,
              applicant.city,
              applicant.industry
            )
          );
          console.log("successfully set applicant's role after logging in");
        }
      }

      let employers = await axios.get('http://3.23.52.34:3000/api/employers');
      employers = employers.data;
      for (const employer of employers) {
        if (employer.email === email) {
          dispatch(
            setUser(
              employer._id,
              employer.name,
              email,
              employer.companyName,
              'employer',
              employer.state,
              employer.city,
              employer.industry
            )
          );
          console.log("successfully set employers's role after logging in");
        }
      }
    } catch (e) {
      alert(e);
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }

  const handleForgotPassword = async () => {
    const email = prompt('Please enter your email address');
    if (email) {
      try {
        await doPasswordReset(email);
        alert(
          `If an account exists for ${email}, an email will be sent with instructions to reset your password.`
        );
      } catch (e) {
        alert(e.message);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <Box>
        <Typography variant='h4' sx={{ marginBottom: 2, color: 'black' }}>
          Log In
        </Typography>

        <form onSubmit={handleLogin} action={<Link to='/postings' />}>
          <TextField
            type='email'
            label='Email'
            color='secondary'
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type='password'
            label='Password'
            color='secondary'
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
          />

          <Button type='submit'>Log In</Button>

          <br />

          <Button onClick={handleForgotPassword}>Forgot Password</Button>

          <br />

          <Typography sx={{ color: 'black', fontSize: 14 }}>
            Don't have an account yet?{' '}
            <Link to='/register'>Register here!</Link>
          </Typography>
        </form>
      </Box>
    </div>
  );
};

export default Login;
