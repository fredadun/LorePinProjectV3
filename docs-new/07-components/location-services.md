# Location Services Component

This document describes the Location Services component of the LorePin system.

## Overview

The Location Services component provides geolocation functionality for the LorePin platform, enabling location-based challenges, user location tracking, and proximity-based features.

## Features

- Location-based challenge discovery
- Geofencing for challenge boundaries
- Proximity search for nearby challenges
- Location verification for submissions
- Map visualization and navigation
- Address geocoding and reverse geocoding
- Location-based analytics

## Architecture

The Location Services component follows a layered architecture:

- **UI Layer**: Map components and location interfaces
- **Service Layer**: Location business logic
- **Provider Layer**: Integration with Google Maps and device location services
- **Storage Layer**: Geospatial data storage in Firestore

## Data Model

```typescript
interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface LocationData {
  geoPoint: GeoPoint;
  address?: {
    formatted: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  placeId?: string;
  name?: string;
  accuracy?: number;  // in meters
  timestamp: number;  // Unix timestamp
}

interface GeofenceArea {
  center: GeoPoint;
  radiusMeters: number;
  name?: string;
  description?: string;
}

interface LocationPreferences {
  trackingEnabled: boolean;
  precisionLevel: 'high' | 'medium' | 'low';
  shareWithFollowers: boolean;
  shareWithChallenges: boolean;
}
```

## API Reference

### Location Services

- `getCurrentLocation(options?: LocationOptions): Promise<LocationData>`
- `watchLocation(callback: (location: LocationData) => void, options?: LocationOptions): WatchId`
- `stopWatchingLocation(watchId: WatchId): void`
- `getLastKnownLocation(): Promise<LocationData | null>`
- `calculateDistance(point1: GeoPoint, point2: GeoPoint): number` // in meters

### Geocoding

- `geocodeAddress(address: string): Promise<LocationData>`
- `reverseGeocode(geoPoint: GeoPoint): Promise<LocationData>`
- `searchPlaces(query: string, near?: GeoPoint, radius?: number): Promise<LocationData[]>`

### Geofencing

- `createGeofence(geofence: GeofenceArea): string` // returns geofence ID
- `checkWithinGeofence(location: GeoPoint, geofence: GeofenceArea): boolean`
- `findNearbyGeofences(location: GeoPoint, maxDistance: number): Promise<GeofenceArea[]>`

### Maps

- `generateStaticMapUrl(center: GeoPoint, zoom: number, markers?: GeoPoint[], size?: { width: number, height: number }): string`
- `getDirections(origin: GeoPoint, destination: GeoPoint, mode?: 'driving' | 'walking' | 'bicycling' | 'transit'): Promise<DirectionsResult>`

## Dependencies

- Google Maps API: For mapping, geocoding, and directions
- Device Location Services: For user location tracking
- Firestore: For geospatial data storage
- Challenges Component: For location-based challenges
- User Profiles Component: For user location preferences

## Security Considerations

- User location data is protected and only shared according to user preferences
- Location tracking is opt-in and can be disabled at any time
- Precise location data is never stored permanently without explicit consent
- Geofencing is implemented client-side to minimize location data transmission
- Location data in transit is encrypted using HTTPS

## Implementation Details

### Frontend Implementation

The Location Services component is implemented in the frontend using:

- React components for maps and location UI
- Google Maps JavaScript API
- Browser Geolocation API
- Custom hooks for location management

```typescript
// Example location hook
function useLocation(options?: LocationOptions) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          geoPoint: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      options
    );
  }, [options]);

  return { location, error, loading };
}
```

### Mobile Implementation

The mobile implementation uses:

- Flutter Google Maps package
- Platform location services
- Geofencing plugins
- Background location tracking (with user permission)

### Backend Implementation

The backend implementation uses:

- Firestore GeoPoint type for location storage
- Cloud Functions for geospatial queries
- Google Maps API for server-side geocoding
- Geohashing for efficient proximity searches

```typescript
// Example Cloud Function for finding nearby challenges
export const findNearbyChallenges = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { latitude, longitude, radiusKm = 5 } = data;
  
  // Validate input
  if (!latitude || !longitude) {
    throw new functions.https.HttpsError('invalid-argument', 'Location coordinates required');
  }

  // Convert km to radians (Earth radius is approximately 6371 km)
  const radiusInRadians = radiusKm / 6371;
  
  // Query challenges within radius
  const center = new admin.firestore.GeoPoint(latitude, longitude);
  const challengesRef = admin.firestore().collection('challenges');
  
  // Get challenges where location is within radius
  const snapshot = await challengesRef.get();
  
  // Filter challenges by distance
  const nearbyChallenges = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(challenge => {
      const location = challenge.location;
      if (!location) return false;
      
      // Calculate distance using Haversine formula
      const lat1 = center.latitude * Math.PI / 180;
      const lat2 = location.latitude * Math.PI / 180;
      const lon1 = center.longitude * Math.PI / 180;
      const lon2 = location.longitude * Math.PI / 180;
      
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;
      
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = 6371 * c; // Distance in km
      
      return distance <= radiusKm;
    });
  
  return { challenges: nearbyChallenges };
});
```

## Testing

The Location Services component is tested using:

- Unit tests for location calculations and geofencing logic
- Integration tests for API interactions
- E2E tests for location-based features
- Mock location services for testing without real GPS

## Future Enhancements

- Advanced geofencing with polygon shapes
- Improved location accuracy using sensor fusion
- Indoor positioning for venue-specific challenges
- Predictive location features based on user patterns
- Augmented reality integration for location-based experiences
- Battery-efficient background location tracking
- Enhanced privacy controls for location sharing 