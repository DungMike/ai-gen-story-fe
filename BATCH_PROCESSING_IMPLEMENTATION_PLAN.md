# Batch Processing Implementation Plan

## Overview
Implement a comprehensive batch processing interface that allows users to upload multiple files and create stories automatically with real-time progress tracking via WebSocket.

## Backend APIs Available
- `POST /stories/batch-upload` - Upload multiple files
- `POST /stories/batch-create` - Create multiple stories from uploaded files
- `POST /stories/:id/generate` - Generate content for a specific story
- `GET /stories/batch/:batchId/status` - Get batch processing status

## WebSocket Events Available
- `batch-stories-start` - Batch processing started
- `batch-stories-progress` - Batch processing progress updates
- `batch-stories-complete` - Batch processing completed
- `batch-stories-error` - Batch processing error
- `auto-mode-start` - Auto mode processing started
- `auto-mode-progress` - Auto mode progress updates
- `auto-mode-complete` - Auto mode completed
- `auto-mode-error` - Auto mode error

## Implementation Tasks

### Phase 1: Core Components Setup ✅
- [x] Analyze backend APIs and DTOs
- [x] Analyze WebSocket events
- [x] Create implementation plan

### Phase 2: File Upload Component ✅
- [x] Create `FileUploadZone` component
  - [x] Drag and drop interface
  - [x] File type validation (.txt, .doc, .docx)
  - [x] File size validation (10MB per file, max 10 files)
  - [x] File preview with remove option
  - [x] Upload progress indicator
  - [x] Error handling and display

### Phase 3: Batch Configuration Component
- [ ] Create `BatchConfigForm` component
  - [ ] Auto mode toggle
  - [ ] Generate images toggle
  - [ ] Generate audio toggle
  - [ ] Audio voice selection
  - [ ] Word per chunk settings
  - [ ] Custom prompts for images and audio
  - [ ] Image style selection
  - [ ] Form validation

### Phase 4: Progress Tracking Component
- [ ] Create `BatchProgress` component
  - [ ] Overall progress bar
  - [ ] Current file indicator
  - [ ] Current step indicator (story, audio, images)
  - [ ] File-by-file progress list
  - [ ] Error display for failed files
  - [ ] Success indicators for completed files

### Phase 5: WebSocket Integration
- [ ] Create `BatchProcessingSocket` hook
  - [ ] Connect to WebSocket server
  - [ ] Listen to batch processing events
  - [ ] Handle real-time progress updates
  - [ ] Handle completion and error events
  - [ ] Reconnection logic

### Phase 6: Main Batch Processing Page
- [ ] Update `BatchProcessingPage` component
  - [ ] Integrate all sub-components
  - [ ] Handle file upload workflow
  - [ ] Handle batch creation workflow
  - [ ] State management for entire process
  - [ ] Error handling and user feedback

### Phase 7: API Integration
- [ ] Create batch processing API service
  - [ ] File upload API integration
  - [ ] Batch creation API integration
  - [ ] Status checking API integration
  - [ ] Error handling and retry logic

### Phase 8: UI/UX Enhancements
- [ ] Add loading states
- [ ] Add success/error notifications
- [ ] Add confirmation dialogs
- [ ] Add responsive design
- [ ] Add accessibility features

### Phase 9: Testing and Polish
- [ ] Test file upload with various file types
- [ ] Test batch processing with different configurations
- [ ] Test WebSocket connection and events
- [ ] Test error scenarios
- [ ] Performance optimization
- [ ] Code cleanup and documentation

## Technical Requirements

### File Upload Requirements
- Support multiple file selection
- Drag and drop functionality
- File type validation (.txt, .doc, .docx)
- File size limit (10MB per file)
- Maximum 10 files per batch
- Progress tracking for upload

### Batch Configuration Requirements
- Auto mode configuration
- Audio generation settings
- Image generation settings
- Custom prompts support
- Form validation

### Progress Tracking Requirements
- Real-time progress updates
- File-by-file status
- Error handling and display
- Completion status
- Estimated time remaining

### WebSocket Requirements
- Real-time connection
- Event handling
- Reconnection logic
- Error handling
- Room management

## Component Structure
```
BatchProcessingPage/
├── FileUploadZone/
├── BatchConfigForm/
├── BatchProgress/
└── BatchProcessingSocket (hook)
```

## State Management
- File upload state
- Batch configuration state
- Processing progress state
- WebSocket connection state
- Error state

## Error Handling
- File upload errors
- API errors
- WebSocket connection errors
- Processing errors
- User feedback for all errors

## Success Criteria
- [ ] Users can upload multiple files successfully
- [ ] Users can configure batch processing settings
- [ ] Real-time progress tracking works
- [ ] WebSocket events are handled correctly
- [ ] Error scenarios are handled gracefully
- [ ] UI is responsive and user-friendly
- [ ] All backend APIs are integrated correctly

## Next Steps
1. Start with Phase 2: File Upload Component
2. Implement drag and drop functionality
3. Add file validation
4. Create upload progress tracking
5. Continue with subsequent phases

## Notes
- Use existing UI components from `@/components/ui`
- Follow existing code patterns and conventions
- Ensure proper TypeScript typing
- Add proper error boundaries
- Consider accessibility requirements
- Test thoroughly with various file types and sizes 