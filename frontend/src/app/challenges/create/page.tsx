'use client';

import React, { useState, useCallback, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';
import { collection, addDoc, GeoPoint, serverTimestamp } from 'firebase/firestore';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
// Date picker imports
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { handleInputChange } from '@/lib/eventHandlers';
import { formatError } from '@/lib/errorHandling';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ImageIcon from '@mui/icons-material/Image';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

// Default center (London)
const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278,
};

/**
 * CreateChallengePage component
 * Form for creating a new challenge
 */
export default function CreateChallengePage() {
  const { currentUser, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState(defaultCenter);
  const [reward, setReward] = useState(20);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 1 week from now
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Form validation
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    locationName: '',
    reward: '',
    endDate: '',
    image: '',
  });
  
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });
  
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Save map instance
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  
  // Handle marker drag
  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocation({ lat, lng });
    }
  }, []);
  
  // Places autocomplete
  const {
    ready,
    value: locationSearchValue,
    suggestions: { status, data },
    setValue: setLocationSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'gb' }, // Restrict to UK
    },
    debounce: 300,
  });
  
  // Handle location selection
  const handleLocationSelect = async (address: string) => {
    setLocationSearchValue(address, false);
    clearSuggestions();
    setLocationName(address);
    
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setLocation({ lat, lng });
      
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
      }
    } catch (error) {
      console.error('Error getting geocode:', error);
    }
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 5MB' });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'File must be an image' });
        return;
      }
      
      setImage(file);
      setErrors({ ...errors, image: '' });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {
      title: title.trim() === '' ? 'Title is required' : '',
      description: description.trim() === '' ? 'Description is required' : '',
      locationName: locationName.trim() === '' ? 'Location is required' : '',
      reward: reward <= 0 ? 'Reward must be greater than 0' : '',
      endDate: !endDate ? 'End date is required' : '',
      image: !image ? 'Image is required' : '',
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Upload image to Firebase Storage
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `challenges/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      // Add challenge to Firestore
      const challengeData = {
        title,
        description,
        locationName,
        location: new GeoPoint(location.lat, location.lng),
        reward,
        difficulty,
        endDate,
        imageUrl,
        creatorId: currentUser.uid,
        sponsorId: currentUser.uid, // In a real app, this would be the sponsor's ID
        sponsorName: currentUser.displayName || 'Anonymous Sponsor',
        participantCount: 0,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'challenges'), challengeData);
      
      setSuccess(true);
      
      // Redirect to the new challenge page after a short delay
      setTimeout(() => {
        router.push(`/challenges/${docRef.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Error creating challenge:', err);
      setError(formatError(err));
    } finally {
      setLoading(false);
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
  
  // If not logged in, redirect to auth page
  if (!authLoading && !currentUser) {
    router.push('/auth');
    return null;
  }
  
  // If Google Maps failed to load, show error
  if (loadError) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography color="error" align="center">
          Error loading maps. Please try again later.
        </Typography>
      </Container>
    );
  }
  
  // If Google Maps is still loading, show loading indicator
  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
        Create Challenge
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Challenge Title"
                value={title}
                onChange={handleInputChange(setTitle)}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
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
              />
            </Grid>
            
            {/* Location */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={locationSearchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLocationSearchValue(e.target.value);
                  setLocationName(e.target.value);
                }}
                error={!!errors.locationName}
                helperText={errors.locationName}
                required
                disabled={!ready}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* Location suggestions */}
              {status === 'OK' && (
                <Paper elevation={3} sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                  {data.map(({ place_id, description }) => (
                    <Box
                      key={place_id}
                      sx={{
                        p: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => handleLocationSelect(description)}
                    >
                      <Typography variant="body2">{description}</Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Grid>
            
            {/* Map */}
            <Grid item xs={12}>
              <Box sx={{ height: 300, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={location}
                  zoom={15}
                  onLoad={onMapLoad}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: true,
                    fullscreenControl: true,
                  }}
                >
                  <MarkerF
                    position={location}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                  />
                </GoogleMap>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Drag the marker to adjust the exact location
              </Typography>
            </Grid>
            
            {/* Reward */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reward (LoreCoins)"
                type="number"
                value={reward}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReward(parseInt(e.target.value) || 0)}
                error={!!errors.reward}
                helperText={errors.reward}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonetizationOnIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            {/* Difficulty */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficulty}
                  onChange={(e: SelectChangeEvent) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  label="Difficulty"
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* End Date */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue: Date | null) => setEndDate(newValue)}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* Image Upload */}
            <Grid item xs={12} sm={6}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<ImageIcon />}
                sx={{ height: '56px', width: '100%' }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {errors.image && (
                <FormHelperText error>{errors.image}</FormHelperText>
              )}
            </Grid>
            
            {/* Image Preview */}
            {imagePreview && (
              <Grid item xs={12}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Challenge preview"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              </Grid>
            )}
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Challenge'}
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
          Challenge created successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
} 