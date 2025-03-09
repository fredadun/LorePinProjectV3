'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/hooks/useAuthContext';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RedeemIcon from '@mui/icons-material/Redeem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

/**
 * Home page component
 * Displays the landing page with hero section and call-to-action
 */
export default function Home() {
  const { currentUser } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          color: 'white', 
          py: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Discover Challenges, <br />
                <Box component="span" sx={{ color: 'secondary.main' }}>
                  Earn Rewards
                </Box>
              </Typography>
              
              <Typography variant="h6" paragraph sx={{ mb: 4, color: 'grey.300' }}>
                Explore your city, complete challenges, and earn LoreCoins that can be redeemed for exclusive rewards.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Button 
                  component={Link} 
                  href={currentUser ? "/challenges" : "/auth"} 
                  variant="contained" 
                  size="large"
                  startIcon={currentUser ? <ExploreIcon /> : <PersonAddIcon />}
                >
                  {currentUser ? "Find Challenges" : "Get Started"}
                </Button>
                
                <Button 
                  component={Link} 
                  href="/explore" 
                  variant="outlined" 
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Explore Map
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', maxWidth: '500px', mx: 'auto' }}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: -20, 
                    left: -20, 
                    width: 300, 
                    height: 300, 
                    bgcolor: 'secondary.main', 
                    opacity: 0.2, 
                    borderRadius: '50%', 
                    filter: 'blur(40px)',
                    zIndex: 0
                  }} 
                />
                
                <Paper 
                  elevation={6} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    position: 'relative', 
                    zIndex: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box 
                    sx={{ 
                      height: 200, 
                      bgcolor: 'grey.800', 
                      borderRadius: 1, 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'grey.500'
                    }}
                  >
                    <Typography>Challenge Preview</Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    Tower Bridge Sunset
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Capture the perfect sunset at Tower Bridge
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" color="primary" fontWeight="bold">
                      50 LoreCoins
                    </Typography>
                    
                    <Button variant="contained" size="small">
                      Join Challenge
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              mb: 6, 
              fontWeight: 'bold',
              fontFamily: 'var(--font-space-grotesk)',
            }}
          >
            How LorePin Works
          </Typography>
          
          <Grid container spacing={4}>
            {/* Feature 1 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box 
                    sx={{ 
                      width: 50, 
                      height: 50, 
                      bgcolor: 'primary.light', 
                      color: 'primary.main',
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <ExploreIcon />
                  </Box>
                  
                  <Typography variant="h5" component="h3" gutterBottom>
                    Discover Challenges
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Find location-based challenges created by sponsors and other users on the interactive map.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature 2 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box 
                    sx={{ 
                      width: 50, 
                      height: 50, 
                      bgcolor: 'primary.light', 
                      color: 'primary.main',
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <EmojiEventsIcon />
                  </Box>
                  
                  <Typography variant="h5" component="h3" gutterBottom>
                    Complete Challenges
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Submit photos or videos to complete challenges and earn LoreCoins as rewards.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature 3 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box 
                    sx={{ 
                      width: 50, 
                      height: 50, 
                      bgcolor: 'primary.light', 
                      color: 'primary.main',
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <RedeemIcon />
                  </Box>
                  
                  <Typography variant="h5" component="h3" gutterBottom>
                    Redeem Rewards
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Use your earned LoreCoins to redeem exclusive discounts, merchandise, and experiences.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              fontFamily: 'var(--font-space-grotesk)',
            }}
          >
            Ready to Start Your Adventure?
          </Typography>
          
          <Typography variant="h6" paragraph sx={{ mb: 4, color: 'grey.300', maxWidth: '800px', mx: 'auto' }}>
            Join thousands of explorers discovering new places, earning rewards, and creating memories.
          </Typography>
          
          <Button 
            component={Link} 
            href={currentUser ? "/challenges" : "/auth"} 
            variant="contained" 
            size="large"
            color="secondary"
          >
            {currentUser ? "Find Challenges" : "Sign Up Now"}
          </Button>
        </Container>
      </Box>
    </Box>
  );
} 