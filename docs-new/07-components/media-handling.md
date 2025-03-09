# Media Handling Component

This document describes the Media Handling component of the LorePin system.

## Overview

The Media Handling component manages the upload, processing, storage, and delivery of media files (images and videos) within the LorePin platform. It ensures efficient storage, optimized delivery, and proper validation of user-submitted media for challenges.

## Features

- Media upload for challenge submissions
- Image and video processing and optimization
- Thumbnail generation
- Content moderation
- Secure storage and access control
- Efficient delivery through CDN
- Media metadata extraction and management

## Architecture

The Media Handling component follows a layered architecture:

- **UI Layer**: Upload interfaces and media viewers
- **Service Layer**: Media processing and management logic
- **Storage Layer**: Firebase Storage integration
- **Processing Layer**: Cloud Functions for media transformations

## Data Model

```typescript
interface MediaItem {
  id: string;
  userId: string;
  type: 'image' | 'video';
  storageUri: string;
  publicUrl: string;
  thumbnailUrl?: string;
  contentType: string;
  size: number; // in bytes
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for videos, in seconds
  metadata: {
    originalFilename: string;
    uploadedAt: Timestamp;
    modifiedAt?: Timestamp;
    location?: {
      latitude: number;
      longitude: number;
    };
    moderationStatus: 'pending' | 'approved' | 'rejected';
    moderationDetails?: {
      reviewedAt: Timestamp;
      reviewedBy?: string;
      rejectionReason?: string;
    };
    tags?: string[];
  };
}

interface MediaUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  generateThumbnail?: boolean;
  autoModerate?: boolean;
  resizeDimensions?: {
    width: number;
    height: number;
  };
  preserveExif?: boolean;
  compressionLevel?: 'high' | 'medium' | 'low' | 'none';
}
```

## API Reference

### Media Upload

- `uploadMedia(file: File, options?: MediaUploadOptions): Promise<MediaItem>`
- `uploadMediaFromUrl(url: string, options?: MediaUploadOptions): Promise<MediaItem>`
- `cancelUpload(uploadId: string): Promise<void>`
- `getUploadProgress(uploadId: string): Promise<number>` // 0-100

### Media Management

- `getMedia(mediaId: string): Promise<MediaItem>`
- `deleteMedia(mediaId: string): Promise<void>`
- `updateMediaMetadata(mediaId: string, metadata: Partial<MediaItem['metadata']>): Promise<MediaItem>`
- `getUserMedia(userId: string, limit: number, startAfter?: string): Promise<MediaItem[]>`

### Media Processing

- `generateThumbnail(mediaId: string, options?: { width: number, height: number }): Promise<string>` // Returns thumbnail URL
- `resizeImage(mediaId: string, dimensions: { width: number, height: number }): Promise<MediaItem>`
- `moderateContent(mediaId: string): Promise<{ approved: boolean, reason?: string }>`
- `extractMetadata(mediaId: string): Promise<any>` // Extract EXIF, video metadata, etc.

### Media Delivery

- `getMediaUrl(mediaId: string, options?: { size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original', expiry?: number }): Promise<string>`
- `getEmbedCode(mediaId: string, options?: { width: number, height: number, autoplay?: boolean }): string`

## Dependencies

- Firebase Storage: For media file storage
- Cloud Functions: For media processing
- Firebase Authentication: For access control
- Firestore: For media metadata storage
- Cloud Vision API: For image analysis and moderation (optional)

## Security Considerations

- Media access is controlled through Firebase Storage security rules
- User-uploaded content is scanned for malware
- Content moderation is applied to prevent inappropriate content
- Media URLs can be time-limited for enhanced security
- Large file uploads are validated on the server side
- Media metadata is stripped of sensitive information

## Implementation Details

### Frontend Implementation

The Media Handling component is implemented in the frontend using:

- React components for media upload and display
- Firebase Storage SDK for upload operations
- Custom hooks for media management
- Progressive loading for images and videos

```typescript
// Example media upload hook
function useMediaUpload() {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const uploadFile = useCallback(async (file: File, options?: MediaUploadOptions) => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Validate file
      if (options?.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds maximum allowed (${options.maxSizeMB}MB)`);
      }
      
      if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed`);
      }
      
      // Create storage reference
      const storageRef = ref(storage, `uploads/${auth.currentUser?.uid}/${Date.now()}_${file.name}`);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          setError(error);
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Create media item in Firestore
          const mediaData: MediaItem = {
            id: storageRef.name,
            userId: auth.currentUser?.uid || '',
            type: file.type.startsWith('image/') ? 'image' : 'video',
            storageUri: storageRef.fullPath,
            publicUrl: downloadURL,
            contentType: file.type,
            size: file.size,
            metadata: {
              originalFilename: file.name,
              uploadedAt: serverTimestamp(),
              moderationStatus: 'pending'
            }
          };
          
          // Save to Firestore
          const mediaRef = doc(db, 'media', mediaData.id);
          await setDoc(mediaRef, mediaData);
          
          setMedia(mediaData);
          setUploading(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setUploading(false);
    }
  }, []);
  
  return { uploadFile, progress, error, media, uploading };
}
```

### Mobile Implementation

The mobile implementation uses:

- Flutter image picker and camera plugins
- Firebase Storage Flutter SDK
- Image compression libraries
- Video processing packages

### Backend Implementation

The backend implementation uses:

- Cloud Functions for media processing
- Firebase Storage for file storage
- Cloud Vision API for content moderation
- FFmpeg for video processing

```typescript
// Example Cloud Function for generating thumbnails
export const generateThumbnail = functions
  .storage
  .object()
  .onFinalize(async (object) => {
    // Exit if this is triggered on a file that is not an image
    if (!object.contentType?.startsWith('image/')) {
      console.log('This is not an image.');
      return null;
    }
    
    // Exit if this is a thumbnail
    if (object.name?.includes('thumb_')) {
      console.log('Already a thumbnail.');
      return null;
    }
    
    const fileBucket = object.bucket;
    const filePath = object.name;
    const contentType = object.contentType;
    
    if (!filePath) {
      console.log('File path is undefined');
      return null;
    }
    
    // Get the file name
    const fileName = path.basename(filePath);
    
    // Download file from bucket
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    
    await bucket.file(filePath).download({destination: tempFilePath});
    console.log('Image downloaded locally to', tempFilePath);
    
    // Generate a thumbnail using Sharp
    const thumbnailFileName = `thumb_${fileName}`;
    const thumbnailFilePath = path.join(os.tmpdir(), thumbnailFileName);
    
    await sharp(tempFilePath)
      .resize(200, 200)
      .toFile(thumbnailFilePath);
    
    console.log('Thumbnail created at', thumbnailFilePath);
    
    // Upload the thumbnail
    const thumbDestination = filePath.replace(fileName, thumbnailFileName);
    await bucket.upload(thumbnailFilePath, {
      destination: thumbDestination,
      metadata: {
        contentType: contentType,
        metadata: {
          firebaseStorageDownloadTokens: uuid(),
        }
      }
    });
    
    // Clean up the local files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(thumbnailFilePath);
    
    console.log('Thumbnail uploaded to Storage at', thumbDestination);
    
    // Update the media item in Firestore with the thumbnail URL
    const mediaId = fileName;
    const mediaRef = admin.firestore().collection('media').doc(mediaId);
    
    // Get the thumbnail URL
    const thumbnailFile = bucket.file(thumbDestination);
    const [thumbnailUrl] = await thumbnailFile.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Far future expiration
    });
    
    // Update the media item
    await mediaRef.update({
      thumbnailUrl: thumbnailUrl
    });
    
    return null;
  });
```

## Testing

The Media Handling component is tested using:

- Unit tests for media processing logic
- Integration tests for upload and download flows
- Performance tests for large file handling
- Security tests for access control

## Future Enhancements

- Advanced video processing (trimming, filters)
- AI-powered content tagging
- Facial recognition (with privacy controls)
- Watermarking options
- 360° media support
- Streaming optimizations for video
- Progressive image loading improvements 