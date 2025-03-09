'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Divider,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Challenge } from '@/types/challenge';
import { mockChallenges } from '@/lib/mockData';
import { formatError } from '@/lib/errorHandling';

/**
 * ChallengeDetailPage component
 * Displays detailed information about a specific challenge
 */
export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const { currentUser, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<{ id: string; name: string; imageUrl: string }[]>([]);

  // Fetch challenge data from Firestore or mock data
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
        
        // Mock participants data (in a real app, this would be fetched from Firestore)
        setParticipants([
          { id: '1', name: 'Alex Johnson', imageUrl: 'https://source.unsplash.com/random/100x100/?portrait,1' },
          { id: '2', name: 'Maria Garcia', imageUrl: 'https://source.unsplash.com/random/100x100/?portrait,2' },
          { id: '3', name: 'James Wilson', imageUrl: 'https://source.unsplash.com/random/100x100/?portrait,3' },
        ]);
      } catch (err: any) {
        console.error('Error fetching challenge:', err);
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenge();
  }, [params.id]);

  // Handle join challenge
  const handleJoinChallenge = () => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    
    // Navigate to the submission page
    router.push(`/challenges/${params.id}/submit`);
  };

  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // If still loading auth state or challenge data, show loading message
  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If error occurred, show error message
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 4 }}>
          Back to Challenges
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

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 4 }}>
        Back to Challenges
      </Button>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Challenge Image */}
          <Paper 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={challenge.imageUrl}
              alt={challenge.title}
              sx={{
                width: '100%',
                height: { xs: 200, sm: 300, md: 400 },
                objectFit: 'cover',
              }}
            />
          </Paper>
          
          {/* Challenge Details */}
          <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {challenge.title}
              </Typography>
              
              <Chip 
                label={challenge.difficulty.toUpperCase()} 
                color={
                  challenge.difficulty === 'easy' 
                    ? 'success' 
                    : challenge.difficulty === 'medium' 
                    ? 'primary' 
                    : 'error'
                }
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1" color="text.secondary">
                {challenge.location.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccessTimeIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1" color="text.secondary">
                {isActive 
                  ? `Ends on ${new Date(challenge.endDate).toLocaleDateString()}` 
                  : `Ended on ${new Date(challenge.endDate).toLocaleDateString()}`
                }
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            
            <Typography variant="body1" paragraph>
              {challenge.description}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Sponsored by: {challenge.sponsorName}
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                {isActive 
                  ? `Complete this challenge to earn ${challenge.reward} LoreCoins!` 
                  : 'This challenge has ended.'
                }
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleJoinChallenge}
                disabled={!isActive}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {isActive 
                  ? `Submit Challenge (${challenge.reward} LoreCoins)` 
                  : 'Challenge Ended'
                }
              </Button>
              
              {!isActive && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  This challenge has ended. Check out other active challenges.
                </Typography>
              )}
            </Box>
          </Paper>
          
          {/* Rules Section */}
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Challenge Rules
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="1. Visit the location specified in the challenge." 
                  secondary="Make sure you're at the exact location to complete the challenge."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="2. Take a photo or video as proof of your visit." 
                  secondary="Your submission must clearly show the location."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="3. Submit your entry before the challenge ends." 
                  secondary="Late submissions will not be accepted."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="4. Follow all local laws and regulations." 
                  secondary="LorePin is not responsible for any violations."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Reward Card */}
          <Card sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reward
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MonetizationOnIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {challenge.reward} LoreCoins
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Complete this challenge to earn LoreCoins that can be redeemed for exclusive rewards.
              </Typography>
            </CardContent>
          </Card>
          
          {/* Participants Card */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Participants
                </Typography>
                
                <Chip 
                  icon={<PersonIcon />} 
                  label={challenge.participantCount} 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
              
              <List>
                {participants.map((participant) => (
                  <ListItem key={participant.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={participant.imageUrl} alt={participant.name} />
                    </ListItemAvatar>
                    <ListItemText primary={participant.name} />
                  </ListItem>
                ))}
              </List>
              
              {participants.length < challenge.participantCount && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  And {challenge.participantCount - participants.length} more participants...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 