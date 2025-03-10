// Mock Firebase Functions Config
jest.mock('firebase-functions', () => {
  return {
    config: () => ({
      openai: {
        api_key: 'test-openai-api-key',
        requests_per_minute: '60'
      },
      vision: {
        requests_per_minute: '60'
      },
      aws: {
        region: 'us-east-1',
        access_key_id: 'test-aws-access-key',
        secret_access_key: 'test-aws-secret-key',
        s3_bucket: 'test-s3-bucket'
      },
      rekognition: {
        requests_per_minute: '20'
      },
      redis: {
        url: 'redis://localhost:6379'
      }
    }),
    logger: {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }
  };
});

// Mock Redis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1)
    };
  });
});

// Mock Axios
jest.mock('axios', () => {
  return {
    get: jest.fn().mockResolvedValue({ data: Buffer.from('test') }),
    post: jest.fn().mockResolvedValue({
      data: {
        results: [
          {
            flagged: false,
            categories: {
              hate: false,
              harassment: false,
              'self-harm': false,
              sexual: false,
              'sexual/minors': false,
              violence: false,
              'violence/graphic': false
            },
            category_scores: {
              hate: 0.01,
              harassment: 0.01,
              'self-harm': 0.01,
              sexual: 0.01,
              'sexual/minors': 0.01,
              violence: 0.01,
              'violence/graphic': 0.01
            }
          }
        ]
      }
    })
  };
});

// Mock AWS SDK
jest.mock('aws-sdk', () => {
  return {
    Rekognition: jest.fn().mockImplementation(() => {
      return {
        startContentModeration: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({ JobId: 'test-job-id' })
        }),
        getContentModeration: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({
            JobId: 'test-job-id',
            JobStatus: 'SUCCEEDED',
            ModerationLabels: []
          })
        })
      };
    }),
    S3: jest.fn().mockImplementation(() => {
      return {
        putObject: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({})
        }),
        deleteObject: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({})
        })
      };
    })
  };
});

// Mock Google Cloud Vision
jest.mock('@google-cloud/vision', () => {
  return {
    ImageAnnotatorClient: jest.fn().mockImplementation(() => {
      return {
        safeSearchDetection: jest.fn().mockResolvedValue([
          {
            safeSearchAnnotation: {
              adult: 'VERY_UNLIKELY',
              spoof: 'VERY_UNLIKELY',
              medical: 'VERY_UNLIKELY',
              violence: 'VERY_UNLIKELY',
              racy: 'VERY_UNLIKELY'
            }
          }
        ]),
        labelDetection: jest.fn().mockResolvedValue([
          {
            labelAnnotations: [
              { description: 'test', score: 0.9 }
            ]
          }
        ]),
        objectLocalization: jest.fn().mockResolvedValue([
          {
            localizedObjectAnnotations: [
              { name: 'object', score: 0.9 }
            ]
          }
        ])
      };
    })
  };
}); 