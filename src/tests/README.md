# Batch Processing Tests

This directory contains comprehensive tests for the batch processing functionality.

## Test Files

### 1. `batch-processing.test.ts`
Unit tests with mocked API calls. Tests all service methods and error scenarios.

### 2. `batch-processing-integration.test.ts`
Integration tests that use actual API calls (when backend is available).

### 3. `batch-processing-manual-test.ts`
Manual test script that can be run in browser console or Node.js.

### 4. `run-batch-tests.ts`
Test runner script for executing all tests.

## Running Tests

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Tests
```bash
npm run test:batch
```

### Browser Console
```javascript
// Import and run in browser console
import { runBatchProcessingTests } from './src/tests/batch-processing-manual-test'
runBatchProcessingTests()
```

## Test Coverage

### File Upload Tests
- ✅ Single file upload
- ✅ Multiple files upload
- ✅ Upload progress tracking
- ✅ Retry mechanism on network errors

### Batch Processing Configuration Tests
- ✅ Basic batch processing
- ✅ Auto mode configuration
- ✅ Custom prompts for each story
- ✅ Different auto mode settings

### Batch Status and Monitoring Tests
- ✅ Get batch status
- ✅ Get detailed job information
- ✅ Cancel batch processing
- ✅ Retry failed stories

### Error Scenarios Tests
- ✅ Network errors
- ✅ Server errors (500)
- ✅ Authentication errors (401)
- ✅ Validation errors (400)
- ✅ Not found errors (404)
- ✅ Rate limiting (429)

### File Validation Tests
- ✅ File size validation
- ✅ File type validation
- ✅ Multiple files validation
- ✅ Mixed valid/invalid files

### Batch Job Management Tests
- ✅ Get user batch jobs with pagination
- ✅ Delete batch job

## Test Data

The tests use two sample files:
- `test-file-1.txt` - "Test file 1 content"
- `test-file-2.txt` - "Test file 2 content"

## API Endpoints Tested

- `POST /api/file-upload/batch-upload` - Upload multiple files
- `POST /api/stories/batch-create` - Create batch stories
- `GET /api/stories/batch/{id}/status` - Get batch status
- `GET /api/stories/batch/{id}` - Get batch job details
- `POST /api/stories/batch/{id}/cancel` - Cancel batch
- `POST /api/stories/batch/{id}/retry` - Retry failed stories
- `GET /api/stories/batch` - Get user batch jobs
- `DELETE /api/stories/batch/{id}` - Delete batch job

## Configuration Options Tested

### Auto Mode Configuration
```javascript
{
  enabled: true,
  generateImages: true,
  generateAudio: true,
  mergeAudio: false,
  audioVoice: 'en-US-Studio-M',
  wordPerChunkImage: 100,
  wordPerChunkAudio: 150,
  customPromptImage: 'Create a beautiful illustration',
  customPromptAudio: 'Generate engaging narration',
  imageStyle: 'realistic'
}
```

### Custom Prompts
```javascript
{
  title: 'Fantasy Story',
  fileUrl: '...',
  customPrompt: 'Create a fantasy story with magical elements'
}
```

## Error Handling

The tests verify proper error handling for:
- Network connectivity issues
- Server errors
- Authentication failures
- Validation errors
- Rate limiting
- File validation errors

## Retry Mechanism

The service includes automatic retry logic for:
- Network errors
- 5xx server errors
- Rate limiting (429)

Retry configuration:
- Max retries: 3
- Initial delay: 1000ms
- Backoff multiplier: 2

## File Validation Rules

- Maximum file size: 10MB
- Allowed file types: `.txt`, `.doc`, `.docx`
- Validation includes both size and type checks

## Running Tests with Backend

To run tests with a real backend:

1. Start the backend server on `http://localhost:3001`
2. Ensure you have a valid authentication token
3. Run the integration tests: `npm run test:integration`

## Running Tests without Backend

The tests are designed to gracefully handle missing backend:
- Unit tests use mocked API calls
- Integration tests skip when backend is unavailable
- Manual tests show appropriate messages

## Debugging

To debug test failures:

1. Check console output for detailed error messages
2. Verify backend server is running
3. Check authentication token is valid
4. Review network connectivity
5. Check file permissions for test files

## Adding New Tests

To add new tests:

1. Add unit tests to `batch-processing.test.ts`
2. Add integration tests to `batch-processing-integration.test.ts`
3. Add manual tests to `batch-processing-manual-test.ts`
4. Update this README with new test descriptions 