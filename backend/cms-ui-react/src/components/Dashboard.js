import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { Title } from 'react-admin';

const Dashboard = () => {
  return (
    <Box>
      <Title title="LorePin CMS Dashboard" />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2 }}>
        <Card sx={{ minWidth: 275, flex: '1 1 45%' }}>
          <CardHeader title="Welcome to LorePin CMS" />
          <CardContent>
            <Typography variant="body1">
              This Content Management System allows you to manage users, roles, content moderation, and challenges for the LorePin platform.
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 275, flex: '1 1 45%' }}>
          <CardHeader title="Moderation Queue" />
          <CardContent>
            <Typography variant="body1">
              There are <strong>0</strong> items waiting for moderation.
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 275, flex: '1 1 45%' }}>
          <CardHeader title="User Management" />
          <CardContent>
            <Typography variant="body1">
              Manage user accounts, roles, and permissions.
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 275, flex: '1 1 45%' }}>
          <CardHeader title="Challenge Management" />
          <CardContent>
            <Typography variant="body1">
              Review and manage challenges submitted by sponsors.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard; 