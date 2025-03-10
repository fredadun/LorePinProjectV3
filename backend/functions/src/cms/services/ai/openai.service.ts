import * as functions from 'firebase-functions';
import axios from 'axios';
import { Redis } from 'ioredis';

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
 * Interface for OpenAI Moderation API response
 */
interface OpenAIModerationResponse {
  id: string;
  model: string;
  results: {
    flagged: boolean;
    categories: {
      sexual: boolean;
      hate: boolean;
      harassment: boolean;
      'self-harm': boolean;
      'sexual/minors': boolean;
      'hate/threatening': boolean;
      'violence/graphic': boolean;
      'self-harm/intent': boolean;
      'self-harm/instructions': boolean;
      'harassment/threatening': boolean;
      violence: boolean;
    };
    category_scores: {
      sexual: number;
      hate: number;
      harassment: number;
      'self-harm': number;
      'sexual/minors': number;
      'hate/threatening': number;
      'violence/graphic': number;
      'self-harm/intent': number;
      'self-harm/instructions': number;
      'harassment/threatening': number;
      violence: number;
    };
  }[];
}

/**
 * Service for OpenAI content moderation
 * Integrates with OpenAI Moderation API for text content analysis
 */
export class OpenAIService {
  private apiKey: string;
  private apiUrl: string = 'https://api.openai.com/v1/moderations';
  private redis: Redis | null = null;
  private requestsPerMinute: number = 60; // Default rate limit
  private tokenBucket: { tokens: number; lastRefill: number } = { tokens: this.requestsPerMinute, lastRefill: Date.now() };

  constructor() {
    // Get API key from Firebase config
    this.apiKey = functions.config().openai?.api_key || process.env.OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured. Text moderation will use fallback implementation.');
    }

    // Initialize Redis if configured
    const redisUrl = functions.config().redis?.url || process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl);
        console.log('Redis connected for OpenAI service caching');
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
      }
    }

    // Configure rate limits
    this.requestsPerMinute = parseInt(functions.config().openai?.requests_per_minute || process.env.OPENAI_REQUESTS_PER_MINUTE || '60', 10);
    this.tokenBucket.tokens = this.requestsPerMinute;
  }

  /**
   * Analyze text content using OpenAI Moderation API
   * @param text The text to analyze
   * @returns The analysis result
   */
  public async analyzeText(text: string): Promise<TextAnalysisResult> {
    // Check if text is empty or too short
    if (!text || text.trim().length < 3) {
      return this.getFallbackAnalysis();
    }

    // Try to get from cache first
    const cachedResult = await this.getCachedResult(text);
    if (cachedResult) {
      return cachedResult;
    }

    // Check if we have enough tokens for the request
    if (!this.checkRateLimit()) {
      console.warn('Rate limit exceeded for OpenAI API. Using fallback implementation.');
      return this.useFallbackAnalysis(text);
    }

    // If API key is not configured, use fallback implementation
    if (!this.apiKey) {
      return this.useFallbackAnalysis(text);
    }

    try {
      // Call OpenAI Moderation API
      const response = await axios.post<OpenAIModerationResponse>(
        this.apiUrl,
        { input: text },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        }
      );

      // Process the response
      const result = this.processApiResponse(response.data);
      
      // Cache the result
      await this.cacheResult(text, result);
      
      return result;
    } catch (error) {
      console.error('Error calling OpenAI Moderation API:', error);
      
      // Use fallback implementation if API call fails
      return this.useFallbackAnalysis(text);
    }
  }

  /**
   * Process the OpenAI Moderation API response
   * @param response The API response
   * @returns The processed analysis result
   */
  private processApiResponse(response: OpenAIModerationResponse): TextAnalysisResult {
    // Get the first result (there should only be one)
    const result = response.results[0];
    
    // Map OpenAI categories to our categories format
    const categories = Object.entries(result.categories).map(([key, flagged]) => {
      return {
        name: key,
        flagged,
        score: result.category_scores[key as keyof typeof result.category_scores] || 0
      };
    });
    
    // Calculate overall toxicity score (average of all category scores)
    const categoryScores = Object.values(result.category_scores);
    const toxicityScore = categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
    
    // Determine if profanity was detected
    const profanityDetected = result.categories.hate || result.categories.harassment;
    
    // Determine sensitive topics
    const sensitiveTopics: string[] = [];
    if (result.categories.hate || result.category_scores.hate > 0.3) {
      sensitiveTopics.push('hate speech');
    }
    if (result.categories.violence || result.category_scores.violence > 0.3) {
      sensitiveTopics.push('violence');
    }
    if (result.categories.sexual || result.category_scores.sexual > 0.3) {
      sensitiveTopics.push('sexual content');
    }
    if (result.categories['self-harm'] || result.category_scores['self-harm'] > 0.3) {
      sensitiveTopics.push('self-harm');
    }
    
    return {
      flagged: result.flagged,
      categories,
      toxicity_score: toxicityScore,
      profanity_detected: profanityDetected,
      sensitive_topics: sensitiveTopics
    };
  }

  /**
   * Get cached analysis result
   * @param text The text to get cached result for
   * @returns The cached result or null if not found
   */
  private async getCachedResult(text: string): Promise<TextAnalysisResult | null> {
    if (!this.redis) {
      return null;
    }

    try {
      // Create a hash of the text to use as cache key
      const cacheKey = `openai:moderation:${this.hashText(text)}`;
      
      // Try to get from cache
      const cachedData = await this.redis.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData) as TextAnalysisResult;
      }
    } catch (error) {
      console.error('Error getting cached result:', error);
    }
    
    return null;
  }

  /**
   * Cache analysis result
   * @param text The text that was analyzed
   * @param result The analysis result
   */
  private async cacheResult(text: string, result: TextAnalysisResult): Promise<void> {
    if (!this.redis) {
      return;
    }

    try {
      // Create a hash of the text to use as cache key
      const cacheKey = `openai:moderation:${this.hashText(text)}`;
      
      // Cache the result with TTL of 24 hours (86400 seconds)
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 86400);
    } catch (error) {
      console.error('Error caching result:', error);
    }
  }

  /**
   * Create a simple hash of text for cache keys
   * @param text The text to hash
   * @returns A hash string
   */
  private hashText(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Check and update rate limit
   * @returns Whether the request is within rate limits
   */
  private checkRateLimit(): boolean {
    const now = Date.now();
    const elapsedMs = now - this.tokenBucket.lastRefill;
    
    // Refill tokens based on elapsed time
    if (elapsedMs > 0) {
      const refillAmount = Math.floor(elapsedMs / 60000 * this.requestsPerMinute);
      this.tokenBucket.tokens = Math.min(this.requestsPerMinute, this.tokenBucket.tokens + refillAmount);
      this.tokenBucket.lastRefill = now;
    }
    
    // Check if we have tokens available
    if (this.tokenBucket.tokens > 0) {
      this.tokenBucket.tokens--;
      return true;
    }
    
    return false;
  }

  /**
   * Use fallback analysis when API is not available
   * @param text The text to analyze
   * @returns A basic analysis result
   */
  private useFallbackAnalysis(text: string): TextAnalysisResult {
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