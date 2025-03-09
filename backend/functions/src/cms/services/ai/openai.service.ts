import * as functions from 'firebase-functions';

/**
 * Interface for text analysis result
 */
export interface TextAnalysisResult {
  flagged: boolean;
  categories: {
    name: string;
    flagged: boolean;
    score: number;
  }[];
  toxicity_score: number;
  profanity_detected: boolean;
  sensitive_topics: string[];
}

/**
 * Service for OpenAI content moderation
 * This is a mock implementation that will be replaced with the actual OpenAI API integration
 */
export class OpenAIService {
  private apiKey: string;

  constructor() {
    // Get API key from Firebase config
    this.apiKey = functions.config().openai?.api_key || process.env.OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured. Text moderation will be limited.');
    }
  }

  /**
   * Analyze text content using OpenAI Moderation API
   * @param text The text to analyze
   * @returns The analysis result
   */
  public async analyzeText(text: string): Promise<TextAnalysisResult> {
    // This is a mock implementation
    // In a real implementation, this would call the OpenAI Moderation API
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple content analysis based on keywords
      const hasProfanity = this.checkForProfanity(text);
      const hasSensitiveContent = this.checkForSensitiveContent(text);
      const toxicityScore = this.calculateToxicityScore(text);
      
      // Generate categories based on content
      const categories = [];
      
      if (hasProfanity) {
        categories.push({
          name: 'profanity',
          flagged: true,
          score: 0.85
        });
      }
      
      if (text.toLowerCase().includes('hate') || text.toLowerCase().includes('discriminat')) {
        categories.push({
          name: 'hate',
          flagged: toxicityScore > 0.7,
          score: toxicityScore
        });
      }
      
      if (text.toLowerCase().includes('threat') || text.toLowerCase().includes('harm')) {
        categories.push({
          name: 'harassment',
          flagged: toxicityScore > 0.6,
          score: toxicityScore * 0.9
        });
      }
      
      // Determine sensitive topics
      const sensitiveTopics = [];
      
      if (text.toLowerCase().includes('politic')) {
        sensitiveTopics.push('politics');
      }
      
      if (text.toLowerCase().includes('religio')) {
        sensitiveTopics.push('religion');
      }
      
      if (text.toLowerCase().includes('race') || text.toLowerCase().includes('ethnic')) {
        sensitiveTopics.push('race/ethnicity');
      }
      
      return {
        flagged: hasProfanity || (hasSensitiveContent && toxicityScore > 0.7),
        categories,
        toxicity_score: toxicityScore,
        profanity_detected: hasProfanity,
        sensitive_topics: sensitiveTopics
      };
    } catch (error) {
      console.error('Error analyzing text:', error);
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Check for profanity in text
   * @param text The text to check
   * @returns Whether profanity was detected
   */
  private checkForProfanity(text: string): boolean {
    const profanityList = ['badword1', 'badword2', 'badword3'];
    const textLower = text.toLowerCase();
    
    return profanityList.some(word => textLower.includes(word));
  }

  /**
   * Check for sensitive content in text
   * @param text The text to check
   * @returns Whether sensitive content was detected
   */
  private checkForSensitiveContent(text: string): boolean {
    const sensitiveList = ['sensitive1', 'sensitive2', 'sensitive3'];
    const textLower = text.toLowerCase();
    
    return sensitiveList.some(word => textLower.includes(word));
  }

  /**
   * Calculate toxicity score based on text content
   * @param text The text to analyze
   * @returns The toxicity score (0-1)
   */
  private calculateToxicityScore(text: string): number {
    // This is a very simple implementation
    // In a real implementation, this would use a more sophisticated algorithm
    
    const textLower = text.toLowerCase();
    let score = 0;
    
    // Check for negative words
    const negativeWords = ['bad', 'hate', 'awful', 'terrible', 'stupid', 'idiot'];
    negativeWords.forEach(word => {
      if (textLower.includes(word)) {
        score += 0.1;
      }
    });
    
    // Check for aggressive language
    const aggressiveWords = ['kill', 'die', 'attack', 'fight', 'hurt'];
    aggressiveWords.forEach(word => {
      if (textLower.includes(word)) {
        score += 0.15;
      }
    });
    
    // Cap score at 1
    return Math.min(1, score);
  }

  /**
   * Get fallback analysis when API is not available
   * @returns A basic analysis result
   */
  private getFallbackAnalysis(): TextAnalysisResult {
    return {
      flagged: false,
      categories: [],
      toxicity_score: 0,
      profanity_detected: false,
      sensitive_topics: []
    };
  }
} 