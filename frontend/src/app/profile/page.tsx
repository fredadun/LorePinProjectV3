'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { handleInputChange, handleKeyPress } from '@/lib/eventHandlers';
import { formatError } from '@/lib/errorHandling';
import { ENABLE_PROFILE_EDITING } from '@/lib/featureFlags';

/**
 * ProfilePage component for viewing and editing user profile
 * Displays user information and allows profile updates
 */
export default function ProfilePage() {
  const { currentUser, userProfile, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth');
    }
  }, [currentUser, authLoading, router]);

  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username should be at least 3 characters')
      .max(20, 'Username should be at most 20 characters')
      .required('Username is required'),
    bio: Yup.string()
      .max(150, 'Bio should be at most 150 characters'),
  });

  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      username: userProfile?.username || '',
      bio: userProfile?.bio || '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!currentUser) return;
      
      setError(null);
      setSuccess(null);
      
      try {
        // Update Firebase Auth profile
        await updateProfile(currentUser, {
          displayName: values.username,
        });
        
        // Update Firestore document
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          username: values.username,
          bio: values.bio,
        });
        
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      } catch (err: any) {
        setError(formatError(err));
      }
    },
  });

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    setUploadLoading(true);
    setError(null);
    
    try {
      // Create a storage reference
      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile
      await updateProfile(currentUser, {
        photoURL: downloadURL,
      });
      
      // Update Firestore document
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        profileImageUrl: downloadURL,
      });
      
      setSuccess('Profile image updated successfully');
      
      // Force refresh to show new image
      window.location.reload();
    } catch (err: any) {
      setError(formatError(err));
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle adding a new skill
  const handleAddSkill = async () => {
    if (!currentUser || !newSkill.trim()) return;
    
    try {
      const skills = [...(userProfile?.skills || [])];
      
      // Check if skill already exists
      if (skills.includes(newSkill.trim())) {
        setError('Skill already exists');
        return;
      }
      
      // Add new skill
      skills.push(newSkill.trim());
      
      // Update Firestore document
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        skills,
      });
      
      setNewSkill('');
      setSuccess('Skill added successfully');
      
      // Force refresh to show new skill
      window.location.reload();
    } catch (err: any) {
      setError(formatError(err));
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!currentUser) return;
    
    try {
      const skills = (userProfile?.skills || []).filter(
        (skill) => skill !== skillToRemove
      );
      
      // Update Firestore document
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        skills,
      });
      
      setSuccess('Skill removed successfully');
      
      // Force refresh to show updated skills
      window.location.reload();
    } catch (err: any) {
      setError(formatError(err));
    }
  };

  // If still loading auth state, show loading message
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If no user profile, show error message
  if (!userProfile) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Alert severity="error">
          User profile not found. Please try logging in again.
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => router.push('/auth')}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Profile Image Section */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={currentUser?.photoURL || undefined}
                alt={userProfile.username}
                sx={{ width: 150, height: 150, mb: 2, mx: 'auto' }}
              />
              {ENABLE_PROFILE_EDITING && (
                <>
                  <input
                    accept="image/*"
                    type="file"
                    id="profile-image-upload"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={uploadLoading}
                  />
                  <label htmlFor="profile-image-upload">
                    <IconButton
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? <CircularProgress size={24} color="inherit" /> : <EditIcon />}
                    </IconButton>
                  </label>
                </>
              )}
            </Box>
            
            <Typography variant="h5" gutterBottom>
              {userProfile.username}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {userProfile.email}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Chip
                label={`${userProfile.loreCoins} LoreCoins`}
                color="primary"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Grid>
          
          {/* Profile Details Section */}
          <Grid item xs={12} md={8}>
            {isEditing && ENABLE_PROFILE_EDITING ? (
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  id="bio"
                  name="bio"
                  label="Bio"
                  multiline
                  rows={4}
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.bio && Boolean(formik.errors.bio)}
                  helperText={formik.touched.bio && formik.errors.bio}
                  margin="normal"
                />
                
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Profile Information</Typography>
                  {ENABLE_PROFILE_EDITING && (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
                
                <Typography variant="body1" paragraph>
                  <strong>Bio:</strong> {userProfile.bio || 'No bio provided'}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Skills
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {userProfile.skills && userProfile.skills.length > 0 ? (
                      userProfile.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          onDelete={ENABLE_PROFILE_EDITING ? () => handleRemoveSkill(skill) : undefined}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No skills added yet
                      </Typography>
                    )}
                  </Box>
                  
                  {ENABLE_PROFILE_EDITING && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        size="small"
                        label="Add a skill"
                        value={newSkill}
                        onChange={handleInputChange(setNewSkill)}
                        onKeyPress={handleKeyPress(handleAddSkill)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddSkill}
                        disabled={!newSkill.trim()}
                      >
                        Add
                      </Button>
                    </Box>
                  )}
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Account Statistics
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{userProfile.followers?.length || 0}</Typography>
                        <Typography variant="body2" color="text.secondary">Followers</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4">{userProfile.following?.length || 0}</Typography>
                        <Typography variant="body2" color="text.secondary">Following</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
} 