'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Box, Container, Paper, Tabs, Tab, Typography } from '@mui/material';

/**
 * AuthPage component that provides login and registration functionality
 * Allows users to toggle between login and register forms
 */
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { currentUser, loading } = useAuthContext();
  const router = useRouter();

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (currentUser && !loading) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // If still loading auth state, show loading message
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Login" id="login-tab" aria-controls="login-panel" />
            <Tab label="Register" id="register-tab" aria-controls="register-panel" />
          </Tabs>
        </Box>
        
        <Box role="tabpanel" hidden={activeTab !== 0} id="login-panel" aria-labelledby="login-tab">
          {activeTab === 0 && <LoginForm />}
        </Box>
        
        <Box role="tabpanel" hidden={activeTab !== 1} id="register-panel" aria-labelledby="register-tab">
          {activeTab === 1 && <RegisterForm />}
        </Box>
      </Paper>
    </Container>
  );
} 