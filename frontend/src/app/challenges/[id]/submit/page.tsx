'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';
import { doc, getDoc, addDoc, collection, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import { Challenge } from '@/types/challenge';
import { mockChallenges } from '@/lib/mockData';
import { handleInputChange } from '@/lib/eventHandlers';
import { formatError } from '@/lib/errorHandling';

/**
 * SubmitChallengePage component
 * Form for submitting a challenge completion
 */
export default function SubmitChallengePage({ params }: { params: { id: string } }) {
  const { currentUser, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Form validation
  const [errors, setErrors] = useState({
    description: '',
    media: '',
    location: '',
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fetch challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        
        try {
          // Try to get challenge document from Firestore
          const challengeDoc = await getDoc(doc(db, 'challenges', params.id));
          
          if (challengeDoc.exists()) {
            // Use Firestore data
            const data = challengeDoc.data();
            const challengeData: Challenge = {
              id: challengeDoc.id,
              title: data.title,
              description: data.description,
              imageUrl: data.imageUrl || 'https://source.unsplash.com/random/800x400/?city',
              location: {
                name: data.locationName || 'Unknown Location',
                lat: data.location?._lat || 0,
                lng: data.location?._long || 0,
              },
              reward: data.reward || 0,
              difficulty: data.difficulty || 'medium',
              endDate: data.endDate?.toDate() || new Date(),
              sponsorId: data.sponsorId || '',
              sponsorName: data.sponsorName || 'Anonymous Sponsor',
              participantCount: data.participantCount || 0,
            };
            
            setChallenge(challengeData);
          } else {
            // If not found in Firestore, try to find in mock data
            console.log('Challenge not found in Firestore, checking mock data');
            const mockChallenge = mockChallenges.find(c => c.id === params.id);
            
            if (mockChallenge) {
              setChallenge(mockChallenge);
            } else {
              setError('Challenge not found');
            }
          }
        } catch (firestoreError) {
          // If Firestore error, try to use mock data
          console.error('Error fetching from Firestore:', firestoreError);
          console.log('Checking mock data instead');
          
          const mockChallenge = mockChallenges.find(c => c.id === params.id);
          
          if (mockChallenge) {
            setChallenge(mockChallenge);
          } else {
            setError('Challenge not found');
          }
        }
      } catch (err: any) {
        console.error('Error fetching challenge:', err);
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenge();
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setErrors({ ...errors, location: '' });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setErrors({ ...errors, location: 'Unable to get your location. Please enable location services.' });
        }
      );
    } else {
      setErrors({ ...errors, location: 'Geolocation is not supported by your browser.' });
    }
  }, [params.id]);
  
  // Handle media upload
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, media: 'File size must be less than 10MB' });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setErrors({ ...errors, media: 'File must be an image or video' });
        return;
      }
      
      setMedia(file);
      setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
      setErrors({ ...errors, media: '' });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove media
  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {
      description: description.trim() === '' ? 'Description is required' : '',
      media: !media ? 'Media is required' : '',
      location: !location ? 'Location is required' : '',
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  // Calculate distance between two points in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    
    if (!challenge) {
      setError('Challenge not found');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    // Check if user is at the challenge location (within 500 meters)
    if (location && challenge.location) {
      const distance = calculateDistance(
        location.lat, 
        location.lng, 
        challenge.location.lat, 
        challenge.location.lng
      );
      
      // If more than 0.5 km away, show warning (but still allow submission for demo purposes)
      if (distance > 0.5) {
        const confirmSubmit = window.confirm(
          `You appear to be ${distance.toFixed(1)} km away from the challenge location. Are you sure you want to submit?`
        );
        
        if (!confirmSubmit) {
          return;
        }
      }
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Upload media to Firebase Storage
      let mediaUrl = '';
      if (media) {
        const storageRef = ref(storage, `submissions/${currentUser.uid}/${params.id}/${Date.now()}_${media.name}`);
        await uploadBytes(storageRef, media);
        mediaUrl = await getDownloadURL(storageRef);
      }
      
      // Add submission to Firestore
      const submissionData = {
        challengeId: params.id,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous User',
        userPhotoURL: currentUser.photoURL || '',
        description,
        mediaUrl,
        mediaType,
        location: location ? { lat: location.lat, lng: location.lng } : null,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        status: 'pending', // pending, approved, rejected
      };
      
      const submissionRef = await addDoc(collection(db, 'submissions'), submissionData);
      
      // Update challenge participant count
      await updateDoc(doc(db, 'challenges', params.id), {
        participantCount: increment(1),
      });
      
      // Award LoreCoins to user (in a real app, this would be handled by a Cloud Function)
      // This is just a placeholder for demonstration purposes
      console.log(`Awarded ${challenge.reward} LoreCoins to user ${currentUser.uid}`);
      
      setSuccess(true);
      
      // Redirect to the challenge page after a short delay
      setTimeout(() => {
        router.push(`/challenges/${params.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting challenge:', err);
      setError(formatError(err));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    router.back();
  };
  
  // If still loading auth state, show loading message
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If not logged in, redirect to auth page
  if (!authLoading && !currentUser) {
    router.push('/auth');
    return null;
  }
  
  // If still loading challenge data, show loading message
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If error occurred, show error message
  if (error && !challenge) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 4 }}>
          Back to Challenge
        </Button>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h5">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  // If challenge not found, show message
  if (!challenge) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 4 }}>
          Back to Challenges
        </Button>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">
            Challenge not found
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  // Calculate if challenge is active
  const isActive = new Date(challenge.endDate) > new Date();
  
  // If challenge is not active, show message
  if (!isActive) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 4 }}>
          Back to Challenge
        </Button>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            This challenge has ended
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You can no longer submit entries for this challenge.
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 4 }}>
        Back to Challenge
      </Button>
      
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          fontFamily: 'var(--font-space-grotesk)',
          mb: 4
        }}
      >
        Submit Challenge
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {challenge.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body1" color="text.secondary">
              {challenge.location.name}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Media Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Upload Photo/Video
              </Typography>
              
              {!mediaPreview ? (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: errors.media ? 'error.main' : 'grey.300',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    cursor: 'pointer',
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept="image/*,video/*"
                    hidden
                    onChange={handleMediaChange}
                  />
                  <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    Click to upload a photo or video
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Max file size: 10MB
                  </Typography>
                  
                  {errors.media && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {errors.media}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ position: 'relative' }}>
                  {mediaType === 'image' ? (
                    <Box
                      component="img"
                      src={mediaPreview}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        objectFit: 'contain',
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <Box
                      component="video"
                      src={mediaPreview}
                      controls
                      ref={videoRef}
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        borderRadius: 2,
                      }}
                    />
                  )}
                  
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                    onClick={handleRemoveMedia}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Grid>
            
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={handleInputChange(setDescription)}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                required
                placeholder="Describe your experience completing this challenge..."
              />
            </Grid>
            
            {/* Location Status */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 1,
                  bgcolor: location ? 'success.light' : 'error.light',
                }}
              >
                <LocationOnIcon sx={{ mr: 1, color: location ? 'success.main' : 'error.main' }} />
                <Typography variant="body2" color={location ? 'success.main' : 'error.main'}>
                  {location 
                    ? 'Your location has been detected.' 
                    : errors.location || 'Unable to detect your location.'
                  }
                </Typography>
              </Box>
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={submitting}
                sx={{ mt: 2, py: 1.5 }}
              >
                {submitting ? <CircularProgress size={24} /> : `Submit & Earn ${challenge.reward} LoreCoins`}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Challenge submitted successfully! You earned {challenge.reward} LoreCoins.
        </Alert>
      </Snackbar>
    </Container>
  );
} 