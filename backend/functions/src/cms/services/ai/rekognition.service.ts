export interface VideoAnalysisResult {
  job_id: string;
  status: string;
  moderation_labels: {
    name: string;
    confidence: number;
    parent_name?: string;
    timestamp?: number;
  }[];
  nsfw_detected: boolean;
  violence_detected: boolean;
  highest_nsfw_confidence: number;
  highest_violence_confidence: number;
  error?: string;
}

export class RekognitionService {
  constructor() {
    console.log('Rekognition service initialized (mock implementation)');
  }

  public async startVideoModeration(videoUrl: string): Promise<string> {
    return 'mock-job-id';
  }

  public async getVideoModerationResults(jobId: string): Promise<VideoAnalysisResult> {
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
} 