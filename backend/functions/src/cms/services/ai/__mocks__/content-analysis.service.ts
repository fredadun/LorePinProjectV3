import { ContentAnalysisResult } from '../content-analysis.service';

/**
 * Mock implementation of ContentAnalysisService for testing
 */
export class ContentAnalysisService {
  /**
   * Mock implementation of analyzeContent
   */
  public async analyzeContent(data: {
    text?: string;
    image_url?: string;
    video_url?: string;
  }): Promise<ContentAnalysisResult> {
    const result: ContentAnalysisResult = {
      risk_score: 0.1,
      flagged: false,
      flagged_categories: [],
      timestamp: new Date().toISOString(),
      analysis_id: 'mock-analysis-id'
    };
    
    if (data.text) {
      result.text_analysis = {
        flagged: false,
        categories: [{ name: 'Test', flagged: false, score: 0.1 }],
        toxicity_score: 0.1,
        profanity_detected: false,
        sensitive_topics: []
      };
    }
    
    if (data.image_url) {
      result.image_analysis = {
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
      };
    }
    
    if (data.video_url) {
      result.video_analysis = {
        job_id: 'test-job-id',
        status: 'IN_PROGRESS',
        moderation_labels: [],
        nsfw_detected: false,
        violence_detected: false,
        highest_nsfw_confidence: 0,
        highest_violence_confidence: 0
      };
    }
    
    return result;
  }

  /**
   * Mock implementation of getVideoAnalysisResults
   */
  public async getVideoAnalysisResults(jobId: string): Promise<any> {
    return {
      job_id: jobId,
      status: 'SUCCEEDED',
      moderation_labels: [],
      nsfw_detected: false,
      violence_detected: false,
      highest_nsfw_confidence: 0,
      highest_violence_confidence: 0
    };
  }

  /**
   * Mock implementation of updateWithVideoResults
   */
  public updateWithVideoResults(
    analysis: ContentAnalysisResult,
    videoAnalysis: any
  ): ContentAnalysisResult {
    const updatedAnalysis = { ...analysis };
    updatedAnalysis.video_analysis = videoAnalysis;
    
    if (videoAnalysis.nsfw_detected || videoAnalysis.violence_detected) {
      updatedAnalysis.risk_score = 0.8;
      updatedAnalysis.flagged = true;
      
      if (videoAnalysis.nsfw_detected) {
        updatedAnalysis.flagged_categories.push('video:Nudity');
      }
      
      if (videoAnalysis.violence_detected) {
        updatedAnalysis.flagged_categories.push('video:Violence');
      }
    }
    
    return updatedAnalysis;
  }
} 