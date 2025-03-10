import { ContentAnalysisService } from '../content-analysis.service';
import { OpenAIService } from '../openai.service';
import { VisionService } from '../vision.service';
import { RekognitionService } from '../rekognition.service';

// Mock the individual services
jest.mock('../openai.service');
jest.mock('../vision.service');
jest.mock('../rekognition.service');

describe('ContentAnalysisService', () => {
  let contentAnalysisService: ContentAnalysisService;
  let mockOpenAIService: jest.Mocked<OpenAIService>;
  let mockVisionService: jest.Mocked<VisionService>;
  let mockRekognitionService: jest.Mocked<RekognitionService>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock implementations
    mockOpenAIService = new OpenAIService() as jest.Mocked<OpenAIService>;
    mockVisionService = new VisionService() as jest.Mocked<VisionService>;
    mockRekognitionService = new RekognitionService() as jest.Mocked<RekognitionService>;

    // Set up mock responses
    mockOpenAIService.analyzeText = jest.fn().mockResolvedValue({
      flagged: false,
      categories: [{ name: 'Test', flagged: false, score: 0.1 }],
      toxicity_score: 0.1,
      profanity_detected: false,
      sensitive_topics: []
    });

    mockVisionService.analyzeImage = jest.fn().mockResolvedValue({
      nsfw_score: 0.1,
      violence_score: 0.1,
      graphic_content_score: 0.1,
      detected_objects: ['object'],
      safe_search: {
        adult: 'VERY_UNLIKELY',
        spoof: 'VERY_UNLIKELY',
        medical: 'VERY_UNLIKELY',
        violence: 'VERY_UNLIKELY',
        racy: 'VERY_UNLIKELY'
      },
      labels: [{ name: 'test', score: 0.9 }]
    });

    mockRekognitionService.startVideoModeration = jest.fn().mockResolvedValue('test-job-id');
    mockRekognitionService.getVideoModerationResults = jest.fn().mockResolvedValue({
      job_id: 'test-job-id',
      status: 'SUCCEEDED',
      moderation_labels: [],
      nsfw_detected: false,
      violence_detected: false,
      highest_nsfw_confidence: 0,
      highest_violence_confidence: 0
    });

    // Create service with mocked dependencies
    contentAnalysisService = new ContentAnalysisService();
    
    // Replace the real services with mocks
    (contentAnalysisService as any).openaiService = mockOpenAIService;
    (contentAnalysisService as any).visionService = mockVisionService;
    (contentAnalysisService as any).rekognitionService = mockRekognitionService;
  });

  describe('analyzeContent', () => {
    it('should analyze text content', async () => {
      const result = await contentAnalysisService.analyzeContent({
        text: 'Test text'
      });

      expect(mockOpenAIService.analyzeText).toHaveBeenCalledWith('Test text');
      expect(result.text_analysis).toBeDefined();
      expect(result.image_analysis).toBeUndefined();
      expect(result.video_analysis).toBeUndefined();
      expect(result.risk_score).toBeDefined();
      expect(result.flagged).toBeDefined();
      expect(result.flagged_categories).toBeDefined();
    });

    it('should analyze image content', async () => {
      const result = await contentAnalysisService.analyzeContent({
        image_url: 'https://example.com/image.jpg'
      });

      expect(mockVisionService.analyzeImage).toHaveBeenCalledWith('https://example.com/image.jpg');
      expect(result.text_analysis).toBeUndefined();
      expect(result.image_analysis).toBeDefined();
      expect(result.video_analysis).toBeUndefined();
      expect(result.risk_score).toBeDefined();
      expect(result.flagged).toBeDefined();
      expect(result.flagged_categories).toBeDefined();
    });

    it('should start video analysis', async () => {
      const result = await contentAnalysisService.analyzeContent({
        video_url: 'https://example.com/video.mp4'
      });

      expect(mockRekognitionService.startVideoModeration).toHaveBeenCalledWith('https://example.com/video.mp4');
      expect(result.text_analysis).toBeUndefined();
      expect(result.image_analysis).toBeUndefined();
      expect(result.video_analysis).toBeDefined();
      expect(result.video_analysis?.status).toBe('IN_PROGRESS');
      expect(result.video_analysis?.job_id).toBe('test-job-id');
      expect(result.risk_score).toBeDefined();
      expect(result.flagged).toBeDefined();
      expect(result.flagged_categories).toBeDefined();
    });

    it('should analyze all content types together', async () => {
      const result = await contentAnalysisService.analyzeContent({
        text: 'Test text',
        image_url: 'https://example.com/image.jpg',
        video_url: 'https://example.com/video.mp4'
      });

      expect(mockOpenAIService.analyzeText).toHaveBeenCalledWith('Test text');
      expect(mockVisionService.analyzeImage).toHaveBeenCalledWith('https://example.com/image.jpg');
      expect(mockRekognitionService.startVideoModeration).toHaveBeenCalledWith('https://example.com/video.mp4');
      expect(result.text_analysis).toBeDefined();
      expect(result.image_analysis).toBeDefined();
      expect(result.video_analysis).toBeDefined();
      expect(result.risk_score).toBeDefined();
      expect(result.flagged).toBeDefined();
      expect(result.flagged_categories).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      mockOpenAIService.analyzeText = jest.fn().mockRejectedValue(new Error('API error'));

      const result = await contentAnalysisService.analyzeContent({
        text: 'Test text'
      });

      expect(result.error).toBeDefined();
      expect(result.error).toContain('API error');
    });
  });

  describe('getVideoAnalysisResults', () => {
    it('should get video analysis results', async () => {
      const result = await contentAnalysisService.getVideoAnalysisResults('test-job-id');

      expect(mockRekognitionService.getVideoModerationResults).toHaveBeenCalledWith('test-job-id');
      expect(result.job_id).toBe('test-job-id');
      expect(result.status).toBe('SUCCEEDED');
    });

    it('should handle errors gracefully', async () => {
      mockRekognitionService.getVideoModerationResults = jest.fn().mockRejectedValue(new Error('API error'));

      const result = await contentAnalysisService.getVideoAnalysisResults('test-job-id');

      expect(result.status).toBe('FAILED');
      expect(result.error).toBeDefined();
      expect(result.error).toContain('API error');
    });
  });

  describe('updateWithVideoResults', () => {
    it('should update analysis with video results', () => {
      const analysis = {
        risk_score: 0.1,
        flagged: false,
        flagged_categories: [],
        timestamp: new Date().toISOString(),
        analysis_id: 'test-analysis'
      };

      const videoAnalysis = {
        job_id: 'test-job-id',
        status: 'SUCCEEDED',
        moderation_labels: [
          { name: 'Nudity', confidence: 80, parent_name: 'Explicit Nudity' }
        ],
        nsfw_detected: true,
        violence_detected: false,
        highest_nsfw_confidence: 80,
        highest_violence_confidence: 0
      };

      const result = contentAnalysisService.updateWithVideoResults(analysis, videoAnalysis);

      expect(result.video_analysis).toBe(videoAnalysis);
      expect(result.risk_score).toBeGreaterThan(analysis.risk_score);
      expect(result.flagged).toBe(true);
      expect(result.flagged_categories).toContain('video:Nudity');
    });
  });
}); 