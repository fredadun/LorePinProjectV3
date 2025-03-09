# Notifications Component

This document describes the Notifications component of the LorePin system.

## Overview

The Notifications component manages the creation, delivery, and tracking of notifications to users across the LorePin platform. It supports both in-app notifications and push notifications to keep users informed about relevant activities and events.

## Features

- In-app notifications
- Push notifications for mobile and web
- Notification preferences and settings
- Notification grouping and batching
- Read/unread status tracking
- Notification templates
- Event-based notification triggers
- Scheduled notifications

## Architecture

The Notifications component follows a layered architecture:

- **UI Layer**: Notification display and interaction components
- **Service Layer**: Notification business logic
- **Provider Layer**: Integration with Firebase Cloud Messaging
- **Storage Layer**: Notification storage in Firestore

## Data Model

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  read: boolean;
  readAt?: Timestamp;
  clicked: boolean;
  clickedAt?: Timestamp;
  actionUrl?: string;
  priority: 'high' | 'normal' | 'low';
  sender?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

type NotificationType = 
  | 'challenge_invite'
  | 'challenge_reminder'
  | 'submission_approved'
  | 'submission_rejected'
  | 'new_follower'
  | 'mention'
  | 'comment'
  | 'like'
  | 'lorecoin_earned'
  | 'lorecoin_redeemed'
  | 'challenge_completed'
  | 'challenge_winner'
  | 'system_announcement';

interface NotificationPreferences {
  userId: string;
  channels: {
    inApp: boolean;
    push: boolean;
    email: boolean;
  };
  types: {
    [key in NotificationType]: {
      enabled: boolean;
      channels?: {
        inApp?: boolean;
        push?: boolean;
        email?: boolean;
      };
    };
  };
  quietHours?: {
    enabled: boolean;
    start: string; // 24-hour format, e.g., "22:00"
    end: string; // 24-hour format, e.g., "07:00"
    timezone: string; // e.g., "America/New_York"
  };
  devices: {
    deviceId: string;
    token: string;
    platform: 'ios' | 'android' | 'web';
    lastActive: Timestamp;
  }[];
}
```

## API Reference

### Notification Management

- `sendNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'clicked'>): Promise<string>` // Returns notification ID
- `sendNotificationToMany(userIds: string[], notification: Omit<Notification, 'id' | 'userId' | 'createdAt' | 'read' | 'clicked'>): Promise<string[]>` // Returns notification IDs
- `markAsRead(notificationId: string): Promise<void>`
- `markAllAsRead(userId: string): Promise<void>`
- `deleteNotification(notificationId: string): Promise<void>`
- `getNotifications(userId: string, options?: { limit: number, startAfter?: string, unreadOnly?: boolean }): Promise<Notification[]>`
- `getUnreadCount(userId: string): Promise<number>`

### Notification Preferences

- `getNotificationPreferences(userId: string): Promise<NotificationPreferences>`
- `updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences>`
- `enableNotificationType(userId: string, type: NotificationType, enabled: boolean): Promise<void>`
- `registerDevice(userId: string, deviceInfo: { token: string, platform: 'ios' | 'android' | 'web' }): Promise<void>`
- `unregisterDevice(userId: string, deviceId: string): Promise<void>`

### Notification Templates

- `getNotificationTemplate(type: NotificationType, data: Record<string, any>): { title: string, body: string }`
- `renderNotificationTemplate(template: string, data: Record<string, any>): string`

## Dependencies

- Firebase Cloud Messaging (FCM): For push notification delivery
- Firestore: For notification storage
- Authentication Component: For user identity
- User Profiles Component: For user preferences

## Security Considerations

- Notifications are only visible to the intended recipient
- Device tokens are securely stored and managed
- Notification content is sanitized to prevent injection attacks
- Rate limiting is applied to prevent notification spam
- Sensitive information is not included in notification content

## Implementation Details

### Frontend Implementation

The Notifications component is implemented in the frontend using:

- React components for notification display
- Firebase Cloud Messaging SDK for web push
- Custom hooks for notification management

```typescript
// Example notification hook
function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Load notifications
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Get notifications from Firestore
    const notificationsRef = collection(db, 'users', currentUser.uid, 'notifications');
    const q = query(
      notificationsRef,
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationList: Notification[] = [];
      let unread = 0;
      
      snapshot.forEach((doc) => {
        const notification = { id: doc.id, ...doc.data() } as Notification;
        notificationList.push(notification);
        
        if (!notification.read) {
          unread++;
        }
      });
      
      setNotifications(notificationList);
      setUnreadCount(unread);
      setLoading(false);
    });
    
    return unsubscribe;
  }, [currentUser]);
  
  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!currentUser) return;
    
    const notificationRef = doc(db, 'users', currentUser.uid, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp()
    });
  }, [currentUser]);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!currentUser) return;
    
    const batch = writeBatch(db);
    
    notifications.forEach(notification => {
      if (!notification.read) {
        const notificationRef = doc(db, 'users', currentUser.uid, 'notifications', notification.id);
        batch.update(notificationRef, {
          read: true,
          readAt: serverTimestamp()
        });
      }
    });
    
    await batch.commit();
  }, [currentUser, notifications]);
  
  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
```

### Mobile Implementation

The mobile implementation uses:

- Flutter local notifications package
- Firebase Cloud Messaging for push notifications
- Background message handling
- Notification channels for Android

### Backend Implementation

The backend implementation uses:

- Cloud Functions for notification triggers
- Firebase Cloud Messaging for push delivery
- Firestore for notification storage
- Scheduled functions for batched notifications

```typescript
// Example Cloud Function for sending a notification
export const sendNotification = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { userId, title, body, type, data: notificationData, priority = 'normal' } = data;
  
  if (!userId || !title || !body || !type) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }
  
  try {
    // Create notification in Firestore
    const notificationRef = admin.firestore().collection('users').doc(userId).collection('notifications').doc();
    
    const notification: Notification = {
      id: notificationRef.id,
      userId,
      type,
      title,
      body,
      data: notificationData || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      clicked: false,
      priority: priority as 'high' | 'normal' | 'low',
      sender: context.auth.uid ? {
        id: context.auth.uid,
        name: context.auth.token.name || 'Unknown User'
      } : undefined
    };
    
    await notificationRef.set(notification);
    
    // Get user's notification preferences
    const userPrefsRef = admin.firestore().collection('userPreferences').doc(userId);
    const userPrefsDoc = await userPrefsRef.get();
    
    if (!userPrefsDoc.exists) {
      console.log(`No preferences found for user ${userId}, using defaults`);
      // Continue with default preferences
    }
    
    const userPrefs = userPrefsDoc.data() as NotificationPreferences || {
      channels: { push: true, inApp: true, email: false },
      types: { [type]: { enabled: true } }
    };
    
    // Check if user has enabled this notification type
    const typePrefs = userPrefs.types[type];
    if (typePrefs && typePrefs.enabled === false) {
      console.log(`User ${userId} has disabled notifications of type ${type}`);
      return { success: true, id: notificationRef.id, sent: false, reason: 'disabled-by-user' };
    }
    
    // Check if push notifications are enabled
    if (userPrefs.channels.push) {
      // Get user's devices
      const devices = userPrefs.devices || [];
      
      if (devices.length === 0) {
        console.log(`No devices registered for user ${userId}`);
        return { success: true, id: notificationRef.id, sent: true, pushSent: false, reason: 'no-devices' };
      }
      
      // Send push notification to all devices
      const messages = devices.map(device => ({
        token: device.token,
        notification: {
          title,
          body,
        },
        data: {
          notificationId: notificationRef.id,
          type,
          ...notificationData
        },
        android: {
          priority: priority === 'high' ? 'high' : 'normal',
          notification: {
            channelId: type
          }
        },
        apns: {
          payload: {
            aps: {
              sound: priority === 'high' ? 'default' : null,
              badge: 1
            }
          }
        }
      }));
      
      const response = await admin.messaging().sendAll(messages);
      console.log(`Successfully sent push notifications: ${response.successCount}/${messages.length}`);
    }
    
    return { success: true, id: notificationRef.id, sent: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification');
  }
});
```

## Testing

The Notifications component is tested using:

- Unit tests for notification logic
- Integration tests for notification delivery
- E2E tests for notification interactions
- Performance tests for high-volume notification scenarios

## Future Enhancements

- Rich media notifications with images and action buttons
- Advanced notification analytics
- Smart notification batching based on user behavior
- AI-powered notification timing optimization
- Topic-based subscriptions
- Webhook integrations for external notification sources
- Enhanced quiet hours with location awareness 