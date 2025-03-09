'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

/**
 * Navigation component for the application
 * Provides responsive navigation with mobile drawer and desktop menu
 */
const Navigation = () => {
  const { currentUser, userProfile } = useAuth();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Handle profile menu open
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle profile menu close
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle drawer toggle
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleProfileMenuClose();
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Navigation items
  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
    { text: 'Challenges', icon: <EmojiEventsIcon />, path: '/challenges' },
    { text: 'LoreCoins', icon: <MonetizationOnIcon />, path: '/lorecoins' },
  ];
  
  // Drawer content
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div">
          LorePin
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            href={item.path}
            onClick={toggleDrawer}
            selected={pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {currentUser ? (
          <>
            <ListItem 
              button 
              component={Link} 
              href="/profile"
              onClick={toggleDrawer}
              selected={pathname === '/profile'}
            >
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem 
            button 
            component={Link} 
            href="/auth"
            onClick={toggleDrawer}
            selected={pathname === '/auth'}
          >
            <ListItemIcon><LoginIcon /></ListItemIcon>
            <ListItemText primary="Login / Register" />
          </ListItem>
        )}
      </List>
    </Box>
  );
  
  // Profile menu
  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      keepMounted
    >
      <MenuItem 
        component={Link} 
        href="/profile" 
        onClick={handleProfileMenuClose}
      >
        Profile
      </MenuItem>
      <MenuItem 
        component={Link} 
        href="/lorecoins" 
        onClick={handleProfileMenuClose}
      >
        LoreCoins
      </MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
  
  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component={Link} 
            href="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 'bold'
            }}
          >
            LorePin
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  href={item.path}
                  color="inherit"
                  sx={{ 
                    mx: 1,
                    color: pathname === item.path ? 'primary.main' : 'inherit',
                    fontWeight: pathname === item.path ? 'bold' : 'normal',
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          {currentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && (
                <Button
                  component={Link}
                  href="/lorecoins"
                  color="inherit"
                  startIcon={<MonetizationOnIcon />}
                  sx={{ mr: 2 }}
                >
                  {userProfile?.loreCoins || 0} LoreCoins
                </Button>
              )}
              <IconButton
                edge="end"
                aria-label="account"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar 
                  src={currentUser.photoURL || undefined} 
                  alt={currentUser.displayName || 'User'} 
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Box>
          ) : (
            <Button
              component={Link}
              href="/auth"
              color="primary"
              variant="contained"
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        {drawerContent}
      </Drawer>
      
      {profileMenu}
    </>
  );
};

export default Navigation; 