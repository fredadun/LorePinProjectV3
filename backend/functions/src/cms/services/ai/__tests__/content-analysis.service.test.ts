import { ContentAnalysisService } from '../content-analysis.service';

// Mock the dependencies
jest.mock('../openai.service');
jest.mock('../vision.service');
jest.mock('../rekognition.service');

describe('ContentAnalysisService', () => {
  it('should be defined', () => {
    const service = new ContentAnalysisService();
    expect(service).toBeDefined();
  });
}); 