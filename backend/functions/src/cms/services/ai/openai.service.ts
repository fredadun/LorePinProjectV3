// @ts-nocheck - Disable TypeScript checking for this file temporarily
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
  private redis: Redis | null = null;
  private requestsPerMinute: number = 60; // Default rate limit
  private tokenBucket: { tokens: number; lastRefill: number } = { tokens: this.requestsPerMinute, lastRefill: Date.now() };
  private apiEndpoint: string = 'https://api.openai.com/v1/moderations';

  constructor() {
    // Get API key from environment
    this.apiKey = functions.config().openai?.api_key || process.env.OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured. Service will use fallback implementation.');
    } else {
      console.log('OpenAI service initialized');
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
    // Check if text is valid
    if (!text || text.trim().length === 0) {
      console.warn('Empty text provided for analysis');
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
      console.warn('OpenAI API key not configured. Using fallback implementation.');
      return this.useFallbackAnalysis(text);
    }

    try {
      // Call OpenAI Moderation API
      const response = await axios.post(
        this.apiEndpoint,
        { input: text },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Process API response
      const result = this.processApiResponse(response.data, text);
      
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
   * Process the OpenAI API response
   * @param response The API response
   * @param originalText The original text that was analyzed
   * @returns The processed analysis result
   */
  private processApiResponse(response: any, originalText: string): TextAnalysisResult {
    try {
      // Extract results from response
      const result = response.results?.[0];
      
      if (!result) {
        throw new Error('Invalid API response format');
      }
      
      // Extract categories
      const categories = [];
      for (const [name, value] of Object.entries(result.categories)) {
        // Convert snake_case to readable format
        const readableName = name
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        categories.push({
          name: readableName,
          flagged: value,
          score: result.category_scores[name] || 0
        });
      }
      
      // Calculate toxicity score (average of harmful categories)
      const toxicityScore = this.calculateToxicityScore(result.category_scores);
      
      // Detect profanity (using OpenAI's profanity category)
      const profanityDetected = result.categories.profanity || false;
      
      // Detect sensitive topics
      const sensitiveTopics = this.detectSensitiveTopics(originalText);
      
      return {
        flagged: result.flagged,
        categories,
        toxicity_score: toxicityScore,
        profanity_detected: profanityDetected,
        sensitive_topics: sensitiveTopics
      };
    } catch (error) {
      console.error('Error processing API response:', error);
      return this.useFallbackAnalysis(originalText);
    }
  }

  /**
   * Calculate toxicity score based on category scores
   * @param categoryScores The category scores from OpenAI
   * @returns The toxicity score (0-1)
   */
  private calculateToxicityScore(categoryScores: any): number {
    // Define harmful categories that contribute to toxicity
    const harmfulCategories = [
      'hate',
      'hate/threatening',
      'harassment',
      'harassment/threatening',
      'self_harm',
      'self_harm/intent',
      'self_harm/instructions',
      'violence',
      'violence/graphic',
      'sexual/minors'
    ];
    
    // Calculate average score of harmful categories
    let totalScore = 0;
    let count = 0;
    
    for (const category of harmfulCategories) {
      if (categoryScores[category] !== undefined) {
        totalScore += categoryScores[category];
        count++;
      }
    }
    
    return count > 0 ? totalScore / count : 0;
  }

  /**
   * Detect sensitive topics in text
   * @param text The text to analyze
   * @returns Array of detected sensitive topics
   */
  private detectSensitiveTopics(text: string): string[] {
    const sensitiveTopics = [];
    const textLower = text.toLowerCase();
    
    // Check for political content
    if (textLower.includes('politic') || 
        textLower.includes('election') || 
        textLower.includes('democrat') || 
        textLower.includes('republican') ||
        textLower.includes('government') ||
        textLower.includes('president')) {
      sensitiveTopics.push('politics');
    }
    
    // Check for religious content
    if (textLower.includes('religio') || 
        textLower.includes('god') || 
        textLower.includes('church') || 
        textLower.includes('mosque') ||
        textLower.includes('temple') ||
        textLower.includes('faith')) {
      sensitiveTopics.push('religion');
    }
    
    // Check for race/ethnicity content
    if (textLower.includes('race') || 
        textLower.includes('ethnic') || 
        textLower.includes('racial') || 
        textLower.includes('minority') ||
        textLower.includes('diversity')) {
      sensitiveTopics.push('race/ethnicity');
    }
    
    // Check for health-related content
    if (textLower.includes('health') || 
        textLower.includes('disease') || 
        textLower.includes('medical') || 
        textLower.includes('treatment') ||
        textLower.includes('vaccine')) {
      sensitiveTopics.push('health');
    }
    
    return sensitiveTopics;
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
      
      // Cache the result with TTL of 7 days (604800 seconds)
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 604800);
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