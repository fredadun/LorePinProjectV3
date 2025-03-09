'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/useAuthContext';
import { collection, query, where, orderBy, getDocs, doc, getDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { formatError } from '@/lib/errorHandling';

// Transaction type
interface LoreCoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'redeem';
  description: string;
  createdAt: Date;
  challengeId?: string;
  challengeTitle?: string;
  rewardId?: string;
  rewardTitle?: string;
}

// Reward type
interface Reward {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cost: number;
  type: 'promo' | 'feature';
  code?: string;
  sponsorId?: string;
  sponsorName?: string;
  available: boolean;
}

/**
 * LoreCoinsPage component
 * Displays user's LoreCoin balance, transaction history, and redemption options
 */
export default function LoreCoinsPage() {
  const { currentUser, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<LoreCoinTransaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [promoCode, setPromoCode] = useState('');
  
  // Fetch user's LoreCoin balance and transactions
  useEffect(() => {
    const fetchLoreCoins = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Get user's balance
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          setBalance(userDoc.data().loreCoins || 0);
        } else {
          console.log('User document not found');
          setBalance(0);
        }
        
        // Get user's transactions
        const transactionsQuery = query(
          collection(db, 'lorecoin_transactions'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        try {
          const querySnapshot = await getDocs(transactionsQuery);
          const transactionsData: LoreCoinTransaction[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            transactionsData.push({
              id: doc.id,
              userId: data.userId,
              amount: data.amount,
              type: data.type,
              description: data.description,
              createdAt: data.createdAt?.toDate() || new Date(),
              challengeId: data.challengeId,
              challengeTitle: data.challengeTitle,
              rewardId: data.rewardId,
              rewardTitle: data.rewardTitle,
            });
          });
          
          setTransactions(transactionsData);
        } catch (firestoreError) {
          console.error('Error fetching transactions:', firestoreError);
          
          // Mock data for development
          setTransactions([
            {
              id: '1',
              userId: currentUser.uid,
              amount: 20,
              type: 'earn',
              description: 'Completed Tower Bridge Sunset challenge',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              challengeId: '1',
              challengeTitle: 'Tower Bridge Sunset',
            },
            {
              id: '2',
              userId: currentUser.uid,
              amount: 15,
              type: 'earn',
              description: 'Completed London Eye Panorama challenge',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              challengeId: '2',
              challengeTitle: 'London Eye Panorama',
            },
            {
              id: '3',
              userId: currentUser.uid,
              amount: 50,
              type: 'redeem',
              description: 'Redeemed 10% off at Café Nero',
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              rewardId: '1',
              rewardTitle: '10% off at Café Nero',
            },
          ]);
        }
        
        // Get available rewards
        const rewardsQuery = query(
          collection(db, 'rewards'),
          where('available', '==', true),
          orderBy('cost', 'asc')
        );
        
        try {
          const querySnapshot = await getDocs(rewardsQuery);
          const rewardsData: Reward[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            rewardsData.push({
              id: doc.id,
              title: data.title,
              description: data.description,
              imageUrl: data.imageUrl,
              cost: data.cost,
              type: data.type,
              code: data.code,
              sponsorId: data.sponsorId,
              sponsorName: data.sponsorName,
              available: data.available,
            });
          });
          
          setRewards(rewardsData);
        } catch (firestoreError) {
          console.error('Error fetching rewards:', firestoreError);
          
          // Mock data for development
          setRewards([
            {
              id: '1',
              title: '10% off at Café Nero',
              description: 'Get 10% off your next purchase at any Café Nero location in London.',
              imageUrl: 'https://source.unsplash.com/random/300x200/?cafe',
              cost: 50,
              type: 'promo',
              code: 'LOREPIN10',
              sponsorId: '1',
              sponsorName: 'Café Nero',
              available: true,
            },
            {
              id: '2',
              title: 'Free Museum Entry',
              description: 'Get free entry to the London Museum of History for one person.',
              imageUrl: 'https://source.unsplash.com/random/300x200/?museum',
              cost: 100,
              type: 'promo',
              code: 'LOREMUSEUM',
              sponsorId: '2',
              sponsorName: 'London Museum of History',
              available: true,
            },
            {
              id: '3',
              title: 'Premium Account (1 Month)',
              description: 'Upgrade to a premium account for 1 month. Get access to exclusive challenges and features.',
              imageUrl: 'https://source.unsplash.com/random/300x200/?premium',
              cost: 200,
              type: 'feature',
              available: true,
            },
          ]);
        }
      } catch (err: any) {
        console.error('Error fetching LoreCoins data:', err);
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoreCoins();
  }, [currentUser]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Open redeem dialog
  const handleOpenRedeemDialog = (reward: Reward) => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    
    if (balance < reward.cost) {
      setError(`You don't have enough LoreCoins to redeem this reward. You need ${reward.cost - balance} more coins.`);
      return;
    }
    
    setSelectedReward(reward);
    setRedeemDialogOpen(true);
  };
  
  // Close redeem dialog
  const handleCloseRedeemDialog = () => {
    setRedeemDialogOpen(false);
    setSelectedReward(null);
    setPromoCode('');
  };
  
  // Redeem reward
  const handleRedeemReward = async () => {
    if (!currentUser || !selectedReward) return;
    
    try {
      setLoading(true);
      
      // Update user's balance
      await updateDoc(doc(db, 'users', currentUser.uid), {
        loreCoins: balance - selectedReward.cost,
      });
      
      // Add transaction
      await addDoc(collection(db, 'lorecoin_transactions'), {
        userId: currentUser.uid,
        amount: selectedReward.cost,
        type: 'redeem',
        description: `Redeemed ${selectedReward.title}`,
        createdAt: serverTimestamp(),
        rewardId: selectedReward.id,
        rewardTitle: selectedReward.title,
      });
      
      // Update local state
      setBalance(balance - selectedReward.cost);
      setTransactions([
        {
          id: Date.now().toString(),
          userId: currentUser.uid,
          amount: selectedReward.cost,
          type: 'redeem',
          description: `Redeemed ${selectedReward.title}`,
          createdAt: new Date(),
          rewardId: selectedReward.id,
          rewardTitle: selectedReward.title,
        },
        ...transactions,
      ]);
      
      // Show success message
      setSuccess(`Successfully redeemed ${selectedReward.title}!`);
      
      // If it's a promo code, show it
      if (selectedReward.type === 'promo' && selectedReward.code) {
        setPromoCode(selectedReward.code);
      } else {
        // Close dialog
        handleCloseRedeemDialog();
      }
    } catch (err: any) {
      console.error('Error redeeming reward:', err);
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
        LoreCoins
      </Typography>
      
      {/* Balance Card */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          mb: 4, 
          background: 'linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <MonetizationOnIcon sx={{ fontSize: 64 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              Your Balance
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {balance} LoreCoins
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="lorecoins tabs">
          <Tab label="Transaction History" />
          <Tab label="Redeem Rewards" />
        </Tabs>
      </Box>
      
      {/* Transaction History Tab */}
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              Transaction History
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : transactions.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">
                  You don't have any transactions yet. Complete challenges to earn LoreCoins!
                </Typography>
              </Paper>
            ) : (
              <List>
                {transactions.map((transaction) => (
                  <Paper key={transaction.id} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                    <ListItem
                      secondaryAction={
                        <Typography 
                          variant="h6" 
                          color={transaction.type === 'earn' ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                        </Typography>
                      }
                    >
                      <ListItemIcon>
                        {transaction.type === 'earn' ? (
                          <ArrowUpwardIcon color="success" />
                        ) : (
                          <ArrowDownwardIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.description}
                        secondary={new Date(transaction.createdAt).toLocaleString()}
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </>
        )}
      </Box>
      
      {/* Redeem Rewards Tab */}
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
          <>
            <Typography variant="h5" gutterBottom>
              Redeem Rewards
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : rewards.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">
                  No rewards available at the moment. Check back later!
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {rewards.map((reward) => (
                  <Grid item xs={12} sm={6} md={4} key={reward.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                      <Box
                        sx={{
                          height: 140,
                          backgroundImage: `url(${reward.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                        }}
                      >
                        <Chip
                          label={reward.type === 'promo' ? 'Promo Code' : 'Feature'}
                          color={reward.type === 'promo' ? 'primary' : 'secondary'}
                          icon={reward.type === 'promo' ? <LocalOfferIcon /> : <CardGiftcardIcon />}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {reward.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {reward.description}
                        </Typography>
                        {reward.sponsorName && (
                          <Typography variant="caption" color="text.secondary">
                            Sponsored by: {reward.sponsorName}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                        <Chip
                          icon={<MonetizationOnIcon />}
                          label={`${reward.cost} LoreCoins`}
                          color="primary"
                          variant="outlined"
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenRedeemDialog(reward)}
                          disabled={balance < reward.cost}
                        >
                          Redeem
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
      
      {/* Redeem Dialog */}
      <Dialog open={redeemDialogOpen} onClose={handleCloseRedeemDialog}>
        <DialogTitle>Confirm Redemption</DialogTitle>
        <DialogContent>
          {selectedReward && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedReward.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedReward.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This will cost you {selectedReward.cost} LoreCoins.
              </Typography>
              
              {promoCode && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    Your promo code:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" align="center">
                    {promoCode}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!promoCode ? (
            <>
              <Button onClick={handleCloseRedeemDialog}>Cancel</Button>
              <Button 
                onClick={handleRedeemReward} 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Confirm'}
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseRedeemDialog} variant="contained" color="primary">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
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
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
} 