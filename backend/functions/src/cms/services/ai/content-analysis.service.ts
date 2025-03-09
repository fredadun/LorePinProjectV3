import { OpenAIService, TextAnalysisResult } from './openai.service';
import { VisionService, ImageAnalysisResult } from './vision.service';
import { RekognitionService, VideoAnalysisResult } from './rekognition.service';

/**
 * Interface for content analysis result
 */
export interface ContentAnalysisResult {
  text_analysis?: TextAnalysisResult;
  image_analysis?: ImageAnalysisResult;
  video_analysis?: VideoAnalysisResult;
  risk_score: number;
  flagged: boolean;
  flagged_categories: string[];
  timestamp: string;
}

/**
 * Service for content analysis using multiple AI services
 */
export class ContentAnalysisService {
  private openaiService: OpenAIService;
  private visionService: VisionService;
  private rekognitionService: RekognitionService;

  constructor() {
    this.openaiService = new OpenAIService();
    this.visionService = new VisionService();
    this.rekognitionService = new RekognitionService();
  }

  /**
   * Analyze content using appropriate AI services
   * @param data The content data to analyze
   * @returns The analysis result
   */
  public async analyzeContent(data: {
    text?: string;
    image_url?: string;
    video_url?: string;
  }): Promise<ContentAnalysisResult> {
    const result: ContentAnalysisResult = {
      risk_score: 0,
      flagged: false,
      flagged_categories: [],
      timestamp: new Date().toISOString()
    };
    
    // Analyze text content if provided
    if (data.text) {
      result.text_analysis = await this.openaiService.analyzeText(data.text);
    }
    
    // Analyze image content if provided
    if (data.image_url) {
      result.image_analysis = await this.visionService.analyzeImage(data.image_url);
    }
    
    // Start video analysis if provided (async process)
    if (data.video_url) {
      try {
        const jobId = await this.rekognitionService.startVideoModeration(data.video_url);
        result.video_analysis = {
          job_id: jobId,
          status: 'IN_PROGRESS',
          moderation_labels: [],
          nsfw_detected: false,
          violence_detected: false,
          highest_nsfw_confidence: 0,
          highest_violence_confidence: 0
        };
      } catch (error: any) {
        console.error('Error starting video analysis:', error);
        result.video_analysis = {
          job_id: 'error',
          status: 'FAILED',
          moderation_labels: [],
          nsfw_detected: false,
          violence_detected: false,
          highest_nsfw_confidence: 0,
          highest_violence_confidence: 0,
          error: error.message
        };
      }
    }
    
    // Calculate overall risk score and flagged status
    result.risk_score = this.calculateRiskScore(result);
    result.flagged = this.determineIfFlagged(result);
    result.flagged_categories = this.getFlaggedCategories(result);
    
    return result;
  }

  /**
   * Get video analysis results for a previously started job
   * @param jobId The job ID
   * @returns The updated content analysis result
   */
  public async getVideoAnalysisResults(jobId: string): Promise<VideoAnalysisResult> {
    return this.rekognitionService.getVideoModerationResults(jobId);
  }

  /**
   * Update content analysis with video results
   * @param analysis The existing content analysis
   * @param videoAnalysis The video analysis results
   * @returns The updated content analysis
   */
  public updateWithVideoResults(
    analysis: ContentAnalysisResult,
    videoAnalysis: VideoAnalysisResult
  ): ContentAnalysisResult {
    const updatedAnalysis = { ...analysis };
    updatedAnalysis.video_analysis = videoAnalysis;
    
    // Recalculate risk score and flagged status
    updatedAnalysis.risk_score = this.calculateRiskScore(updatedAnalysis);
    updatedAnalysis.flagged = this.determineIfFlagged(updatedAnalysis);
    updatedAnalysis.flagged_categories = this.getFlaggedCategories(updatedAnalysis);
    
    return updatedAnalysis;
  }

  /**
   * Calculate overall risk score based on all analyses
   * @param analysis The content analysis
   * @returns The risk score (0-1)
   */
  private calculateRiskScore(analysis: ContentAnalysisResult): number {
    let textScore = 0;
    let imageScore = 0;
    let videoScore = 0;
    
    // Calculate text risk score
    if (analysis.text_analysis) {
      textScore = analysis.text_analysis.toxicity_score;
      
      // Increase score if flagged
      if (analysis.text_analysis.flagged) {
        textScore = Math.max(textScore, 0.8);
      }
    }
    
    // Calculate image risk score
    if (analysis.image_analysis) {
      // Combine NSFW, violence, and graphic content scores
      imageScore = Math.max(
        analysis.image_analysis.nsfw_score,
        analysis.image_analysis.violence_score,
        analysis.image_analysis.graphic_content_score
      );
    }
    
    // Calculate video risk score
    if (analysis.video_analysis && analysis.video_analysis.status === 'SUCCEEDED') {
      // Combine NSFW and violence scores
      videoScore = Math.max(
        analysis.video_analysis.highest_nsfw_confidence / 100,
        analysis.video_analysis.highest_violence_confidence / 100
      );
    }
    
    // Calculate weighted average based on available analyses
    let totalWeight = 0;
    let weightedScore = 0;
    
    if (analysis.text_analysis) {
      weightedScore += textScore * 0.3;
      totalWeight += 0.3;
    }
    
    if (analysis.image_analysis) {
      weightedScore += imageScore * 0.4;
      totalWeight += 0.4;
    }
    
    if (analysis.video_analysis && analysis.video_analysis.status === 'SUCCEEDED') {
      weightedScore += videoScore * 0.5;
      totalWeight += 0.5;
    }
    
    // Normalize score
    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  /**
   * Determine if content should be flagged based on analysis
   * @param analysis The content analysis
   * @returns Whether the content should be flagged
   */
  private determineIfFlagged(analysis: ContentAnalysisResult): boolean {
    // Flag if risk score is high
    if (analysis.risk_score >= 0.7) {
      return true;
    }
    
    // Flag if text is flagged
    if (analysis.text_analysis?.flagged) {
      return true;
    }
    
    // Flag if image has high NSFW or violence score
    if (analysis.image_analysis && 
        (analysis.image_analysis.nsfw_score >= 0.8 || 
         analysis.image_analysis.violence_score >= 0.8)) {
      return true;
    }
    
    // Flag if video has NSFW or violence detected
    if (analysis.video_analysis?.status === 'SUCCEEDED' && 
        (analysis.video_analysis.nsfw_detected || 
         analysis.video_analysis.violence_detected)) {
      return true;
    }
    
    return false;
  }

  /**
   * Get flagged categories based on analysis
   * @param analysis The content analysis
   * @returns The flagged categories
   */
  private getFlaggedCategories(analysis: ContentAnalysisResult): string[] {
    const categories: string[] = [];
    
    // Add text categories
    if (analysis.text_analysis) {
      if (analysis.text_analysis.flagged) {
        analysis.text_analysis.categories
          .filter(category => category.flagged)
          .forEach(category => categories.push(`text:${category.name}`));
      }
      
      if (analysis.text_analysis.profanity_detected) {
        categories.push('text:profanity');
      }
    }
    
    // Add image categories
    if (analysis.image_analysis) {
      if (analysis.image_analysis.nsfw_score >= 0.7) {
        categories.push('image:nsfw');
      }
      
      if (analysis.image_analysis.violence_score >= 0.7) {
        categories.push('image:violence');
      }
      
      if (analysis.image_analysis.graphic_content_score >= 0.7) {
        categories.push('image:graphic');
      }
    }
    
    // Add video categories
    if (analysis.video_analysis?.status === 'SUCCEEDED') {
      if (analysis.video_analysis.nsfw_detected) {
        categories.push('video:nsfw');
      }
      
      if (analysis.video_analysis.violence_detected) {
        categories.push('video:violence');
      }
      
      // Add specific moderation labels
      analysis.video_analysis.moderation_labels
        .filter(label => label.confidence >= 70)
        .forEach(label => categories.push(`video:${label.name}`));
    }
    
    return [...new Set(categories)]; // Remove duplicates
  }
} 