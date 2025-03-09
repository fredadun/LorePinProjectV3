'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Challenge, difficultyOrder } from '@/types/challenge';
import { mockChallenges } from '@/lib/mockData';
import { handleInputChange, handlePageChange } from '@/lib/eventHandlers';
import { formatError } from '@/lib/errorHandling';

/**
 * ChallengesPage component
 * Displays a list of available challenges with filtering and sorting options
 */
export default function ChallengesPage() {
  const { currentUser, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('reward');
  const [page, setPage] = useState(1);
  const challengesPerPage = 6;

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
            setFilteredChallenges(mockChallenges);
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
            setFilteredChallenges(challengesData);
          }
        } catch (firestoreError) {
          // If Firestore error, use mock data
          console.error('Error fetching from Firestore:', firestoreError);
          console.log('Using mock data instead');
          setChallenges(mockChallenges);
          setFilteredChallenges(mockChallenges);
        }
      } catch (err: any) {
        console.error('Error in fetch process:', err);
        setError(formatError(err));
        
        // Fallback to mock data
        setChallenges(mockChallenges);
        setFilteredChallenges(mockChallenges);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenges();
  }, []);

  // Filter and sort challenges when search term or sort by changes
  useEffect(() => {
    if (challenges.length === 0) return;
    
    // Filter challenges by search term
    let filtered = challenges.filter(
      (challenge) =>
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort challenges
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'reward') {
        return b.reward - a.reward;
      } else if (sortBy === 'endDate') {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      } else if (sortBy === 'difficulty') {
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      }
      return 0;
    });
    
    setFilteredChallenges(filtered);
    setPage(1);
  }, [challenges, searchTerm, sortBy]);

  // Get current page challenges
  const indexOfLastChallenge = page * challengesPerPage;
  const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge);
  const pageCount = Math.ceil(filteredChallenges.length / challengesPerPage);

  // Handle page change
  const onPageChange = handlePageChange(setPage);

  // Handle challenge click
  const handleChallengeClick = (challengeId: string) => {
    router.push(`/challenges/${challengeId}`);
  };

  // Custom select change handler for Material UI Select component
  const handleMuiSelectChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value);
    };

  // If still loading auth state, show loading message
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontFamily: 'var(--font-space-grotesk)',
            mb: 0
          }}
        >
          Challenges
        </Typography>
        
        {currentUser && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => router.push('/challenges/create')}
          >
            Create Challenge
          </Button>
        )}
      </Box>
      
      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search challenges..."
          value={searchTerm}
          onChange={handleInputChange(setSearchTerm)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={handleMuiSelectChange(setSortBy)}
          >
            <MenuItem value="reward">Highest Reward</MenuItem>
            <MenuItem value="endDate">Ending Soon</MenuItem>
            <MenuItem value="difficulty">Difficulty</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Challenges Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" sx={{ my: 4 }}>
          {error}
        </Typography>
      ) : filteredChallenges.length === 0 ? (
        <Typography align="center" sx={{ my: 4 }}>
          No challenges found. Try adjusting your search criteria.
        </Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {currentChallenges.map((challenge) => (
              <Grid item key={challenge.id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => handleChallengeClick(challenge.id)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={challenge.imageUrl}
                    alt={challenge.title}
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
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
                      />
                      
                      <Chip 
                        size="small" 
                        icon={<MonetizationOnIcon />} 
                        label={`${challenge.reward} LC`}
                        color="secondary"
                      />
                    </Box>
                    
                    <Typography variant="h6" component="h2" gutterBottom>
                      {challenge.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {challenge.description.length > 100
                        ? `${challenge.description.substring(0, 100)}...`
                        : challenge.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {challenge.location.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Ends: {new Date(challenge.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button size="small" color="primary">
                      View Details
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      {challenge.participantCount} participants
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={pageCount} 
                page={page} 
                onChange={onPageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
} 