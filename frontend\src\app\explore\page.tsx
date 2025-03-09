'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Challenge } from '@/types/challenge';
import { mockChallenges } from '@/lib/mockData';
import { handleInputChange } from '@/lib/eventHandlers';
import { formatError } from '@/lib/errorHandling';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '70vh',
};

// Default center (London)
const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278,
};

/**
 * ExplorePage component
 * Displays challenges on an interactive map
 */
export default function ExplorePage() {
  const { currentUser, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
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
  
  // Pan to challenge location
  const panTo = useCallback(({ lat, lng }: { lat: number; lng: number }) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
  }, []);
  
  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);
  
  // Fetch challenges from Firestore or use mock data
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        
        // Create a query to get challenges
        const challengesQuery = query(
          collection(db, 'challenges'),
          orderBy('reward', 'desc'),
          limit(50)
        );
        
        try {
          const querySnapshot = await getDocs(challengesQuery);
          const challengesData: Challenge[] = [];
          
          if (querySnapshot.empty) {
            // If no data in Firestore, use mock data
            console.log('No challenges found in Firestore, using mock data');
            setChallenges(mockChallenges);
          } else {
            // Use Firestore data
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              challengesData.push({
                id: doc.id,
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl || 'https://source.unsplash.com/random/300x200/?city',
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
              });
            });
            
            setChallenges(challengesData);
          }
        } catch (firestoreError) {
          // If Firestore error, use mock data
          console.error('Error fetching from Firestore:', firestoreError);
          console.log('Using mock data instead');
          setChallenges(mockChallenges);
        }
      } catch (err: any) {
        console.error('Error in fetch process:', err);
        setError(formatError(err));
        
        // Fallback to mock data
        setChallenges(mockChallenges);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenges();
  }, []);
  
  // Filter challenges by search term
  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle challenge click
  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    panTo(challenge.location);
    setDrawerOpen(true);
  };
  
  // Handle challenge details click
  const handleViewDetails = (challengeId: string) => {
    router.push(`/challenges/${challengeId}`);
  };
  
  // If still loading auth state, show loading message
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        Explore Map
      </Typography>
      
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search challenges or locations..."
          value={searchTerm}
          onChange={handleInputChange(setSearchTerm)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Map */}
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
            onLoad={onMapLoad}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {/* User Location Marker */}
            {userLocation && (
              <MarkerF
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                }}
              />
            )}
            
            {/* Challenge Markers */}
            {filteredChallenges.map((challenge) => (
              <MarkerF
                key={challenge.id}
                position={challenge.location}
                onClick={() => handleChallengeClick(challenge)}
                icon={{
                  url: `/marker-${challenge.difficulty}.svg`,
                  scaledSize: new google.maps.Size(40, 40),
                }}
              />
            ))}
            
            {/* Info Window for Selected Challenge */}
            {selectedChallenge && (
              <InfoWindowF
                position={selectedChallenge.location}
                onCloseClick={() => setSelectedChallenge(null)}
              >
                <Box sx={{ maxWidth: 200 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedChallenge.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedChallenge.location.name}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={`${selectedChallenge.reward} LoreCoins`}
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => handleViewDetails(selectedChallenge.id)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </Box>
              </InfoWindowF>
            )}
          </GoogleMap>
        )}
      </Paper>
      
      {/* Challenge List */}
      <Typography variant="h5" gutterBottom>
        Nearby Challenges
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredChallenges.length === 0 ? (
        <Typography align="center" sx={{ py: 4 }}>
          No challenges found. Try adjusting your search criteria.
        </Typography>
      ) : (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          {filteredChallenges.slice(0, 5).map((challenge) => (
            <React.Fragment key={challenge.id}>
              <ListItem 
                alignItems="flex-start" 
                button 
                onClick={() => handleChallengeClick(challenge)}
              >
                <ListItemAvatar>
                  <Avatar 
                    alt={challenge.title} 
                    src={challenge.imageUrl}
                    variant="rounded"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={challenge.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block' }}
                      >
                        {challenge.location.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2" color="primary">
                          {challenge.reward} LoreCoins
                        </Typography>
                      </Box>
                    </>
                  }
                />
                <Chip 
                  size="small" 
                  label={challenge.difficulty.toUpperCase()} 
                  color={
                    challenge.difficulty === 'easy' 
                      ? 'success' 
                      : challenge.difficulty === 'medium' 
                      ? 'primary' 
                      : 'error'
                  }
                  sx={{ ml: 1 }}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
          <ListItem>
            <Button 
              fullWidth 
              onClick={() => router.push('/challenges')}
              color="primary"
            >
              View All Challenges
            </Button>
          </ListItem>
        </List>
      )}
      
      {/* Challenge Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 2 }}>
          {selectedChallenge && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Challenge Details</Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Box 
                component="img"
                src={selectedChallenge.imageUrl}
                alt={selectedChallenge.title}
                sx={{ 
                  width: '100%', 
                  height: 160, 
                  objectFit: 'cover', 
                  borderRadius: 1,
                  mb: 2
                }}
              />
              
              <Typography variant="h6" gutterBottom>
                {selectedChallenge.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedChallenge.location.name}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  size="small" 
                  label={selectedChallenge.difficulty.toUpperCase()} 
                  color={
                    selectedChallenge.difficulty === 'easy' 
                      ? 'success' 
                      : selectedChallenge.difficulty === 'medium' 
                      ? 'primary' 
                      : 'error'
                  }
                />
                
                <Chip 
                  size="small" 
                  icon={<MonetizationOnIcon />} 
                  label={`${selectedChallenge.reward} LC`}
                  color="secondary"
                />
              </Box>
              
              <Typography variant="body2" paragraph>
                {selectedChallenge.description}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Sponsored by: {selectedChallenge.sponsorName}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Ends: {new Date(selectedChallenge.endDate).toLocaleDateString()}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedChallenge.participantCount} participants
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={() => handleViewDetails(selectedChallenge.id)}
              >
                View Full Details
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </Container>
  );
} 