#!/bin/bash

# Set up environment variables for testing
export OPENAI_API_KEY="test-openai-api-key"
export AWS_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="test-aws-access-key"
export AWS_SECRET_ACCESS_KEY="test-aws-secret-key"
export AWS_S3_BUCKET="test-s3-bucket"

# Run the tests
echo "Running tests for AI services..."
npx jest src/cms/services/ai/__tests__ --verbose

# Check the test result
if [ $? -eq 0 ]; then
  echo "✅ All tests passed!"
else
  echo "❌ Some tests failed. Please check the output above."
  exit 1
fi 