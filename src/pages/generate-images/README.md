# Image Generation Page

This page provides a comprehensive interface for generating AI-powered images for stories.

## Features

### 🎨 Modern UI
- Clean, responsive design with Tailwind CSS
- Real-time progress indicators
- Interactive image cards with expandable details
- Status badges and icons for visual feedback

### 🔌 API Integration
- Full integration with backend image generation API
- React Query for efficient data fetching and caching
- Automatic refetching during processing
- Error handling with user-friendly messages

### 📡 Socket Integration
- Real-time progress updates via WebSocket
- Live status monitoring
- Automatic room management (join/leave)
- Event-driven UI updates

### 🛠️ Functionality
- **Generate Images**: Start image generation for a story
- **Retry Failed**: Retry failed image generations
- **Download All**: Download all images as ZIP
- **Delete Operations**: Delete individual images or all images
- **Real-time Progress**: Live progress tracking with detailed statistics

## Components

### Main Page (`index.tsx`)
- Header with navigation and connection status
- Story information display
- Processing status with progress bars
- Action buttons for all operations
- Image grid with individual cards

### ImageChunkCard Component
- Displays individual image chunks
- Expandable details view
- Status indicators
- Delete functionality
- Image preview (when available)

## API Endpoints Used

- `POST /api/images/generate/:storyId` - Start image generation
- `GET /api/images/story/:storyId` - Get all images for a story
- `GET /api/images/status/:storyId` - Get processing status
- `POST /api/images/retry/:storyId` - Retry failed images
- `DELETE /api/images/chunk/:id` - Delete individual image
- `DELETE /api/images/story/:storyId` - Delete all images
- `GET /api/images/download/:storyId` - Download all images as ZIP

## Socket Events

- `join-image-room` - Join room for real-time updates
- `leave-image-room` - Leave room
- `image:processing:start` - Generation started
- `image:processing:progress` - Progress update
- `image:processing:complete` - Generation completed
- `image:processing:error` - Generation failed

## Usage

1. Navigate to `/generate-images/:storyId`
2. View story information and current status
3. Click "Generate Images" to start generation
4. Monitor real-time progress
5. View generated images in the grid
6. Download, retry, or delete images as needed

## Dependencies

- React Query for data management
- Socket.io for real-time updates
- Lucide React for icons
- Tailwind CSS for styling
- Radix UI components for UI elements 