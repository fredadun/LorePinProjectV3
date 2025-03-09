'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button, TextField, Typography, Box, Divider, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { ENABLE_SOCIAL_LOGIN } from '@/lib/featureFlags';
import { formatError } from '@/lib/errorHandling';

/**
 * LoginForm component for user authentication
 * Provides email/password login and social login options
 */
const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should be at least 8 characters')
      .required('Password is required'),
  });

  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        // Successful login is handled by the auth state listener in AuthProvider
      } catch (err: any) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Successful login is handled by the auth state listener in AuthProvider
    } catch (err: any) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Facebook sign-in
  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      // Successful login is handled by the auth state listener in AuthProvider
    } catch (err: any) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Log in to LorePin
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />
        
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      {ENABLE_SOCIAL_LOGIN && (
        <>
          <Divider sx={{ my: 3 }}>or</Divider>
          
          <Button
            startIcon={<GoogleIcon />}
            variant="outlined"
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Sign in with Google
          </Button>
          
          <Button
            startIcon={<FacebookIcon />}
            variant="outlined"
            fullWidth
            onClick={handleFacebookSignIn}
            disabled={loading}
          >
            Sign in with Facebook
          </Button>
        </>
      )}
    </Box>
  );
};

export default LoginForm; 