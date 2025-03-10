# AI Content Moderation Services

This directory contains the AI services used for content moderation in the LorePin CMS. These services integrate with external AI providers to analyze text, image, and video content for inappropriate or sensitive material.

## Services Overview

- **OpenAI Service**: Uses OpenAI's Moderation API to analyze text content
- **Google Vision Service**: Uses Google Cloud Vision API to analyze image content
- **AWS Rekognition Service**: Uses AWS Rekognition to analyze video content
- **Content Analysis Service**: Coordinates the above services and provides a unified API

## Setup Instructions

### Prerequisites

- Node.js 18 or later
- Firebase CLI
- API keys for OpenAI, Google Cloud, and AWS

### Environment Configuration

Configure the following environment variables in your Firebase project:

```bash
# OpenAI Configuration
firebase functions:config:set openai.api_key="your-openai-api-key"
firebase functions:config:set openai.requests_per_minute="60"

# Google Cloud Vision Configuration
# Note: Google Cloud credentials are automatically loaded from the environment
firebase functions:config:set vision.requests_per_minute="60"

# AWS Rekognition Configuration
firebase functions:config:set aws.region="us-east-1"
firebase functions:config:set aws.access_key_id="your-aws-access-key"
firebase functions:config:set aws.secret_access_key="your-aws-secret-key"
firebase functions:config:set aws.s3_bucket="your-s3-bucket-name"
firebase functions:config:set rekognition.requests_per_minute="20"

# Redis Configuration (optional, for caching)
firebase functions:config:set redis.url="your-redis-url"
```

### Local Development

For local development, create a `.runtimeconfig.json` file in the `functions` directory with the following structure:

```json
{
  "openai": {
    "api_key": "your-openai-api-key",
    "requests_per_minute": "60"
  },
  "vision": {
    "requests_per_minute": "60"
  },
  "aws": {
    "region": "us-east-1",
    "access_key_id": "your-aws-access-key",
    "secret_access_key": "your-aws-secret-key",
    "s3_bucket": "your-s3-bucket-name"
  },
  "rekognition": {
    "requests_per_minute": "20"
  },
  "redis": {
    "url": "your-redis-url"
  }
}
```

### Google Cloud Authentication

For Google Cloud Vision API, you need to set up authentication:

1. Create a service account in the Google Cloud Console
2. Download the service account key as JSON
3. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of the JSON file:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

### AWS S3 Bucket Setup

For AWS Rekognition, you need to set up an S3 bucket:

1. Create an S3 bucket in the AWS Console
2. Configure the bucket to allow the Rekognition service to access it
3. Set up appropriate lifecycle rules to delete temporary files (recommended: 7-day expiration)

## Usage

### Analyzing Content

```typescript
import { ContentAnalysisService } from './cms/services/ai/content-analysis.service';

// Initialize the service
const contentAnalysisService = new ContentAnalysisService();

// Analyze content
const result = await contentAnalysisService.analyzeContent({
  text: "Sample text to analyze",
  image_url: "https://example.com/image.jpg",
  video_url: "https://example.com/video.mp4"
});

// For video content, the analysis is asynchronous
// You need to check the status and get the results later
if (result.video_analysis && result.video_analysis.status === 'IN_PROGRESS') {
  const jobId = result.video_analysis.job_id;
  
  // Check the status later
  const videoResult = await contentAnalysisService.getVideoAnalysisResults(jobId);
  
  // Update the analysis with the video results
  const updatedResult = contentAnalysisService.updateWithVideoResults(result, videoResult);
}
```

## Error Handling

All services include fallback mechanisms for when the external APIs are unavailable or rate limits are exceeded. The fallback implementations provide basic content analysis based on keyword matching and pattern recognition.

## Caching

If Redis is configured, the services will cache results to improve performance and reduce API costs. The default cache TTL is 7 days.

## Rate Limiting

All services implement token bucket rate limiting to prevent exceeding the API rate limits. The default limits are:

- OpenAI: 60 requests per minute
- Google Vision: 60 requests per minute
- AWS Rekognition: 20 requests per minute

## Monitoring and Logging

The services include comprehensive logging to help with monitoring and debugging. All API calls, errors, and important events are logged.

## Testing

To run the tests:

```bash
npm test
```

## License

This code is proprietary and confidential. Unauthorized use, reproduction, or distribution is prohibited. 