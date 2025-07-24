# Audio Service Integration - Frontend

## 🎯 Tổng quan

Đã hoàn thành tích hợp service generate-audio từ backend vào frontend với đầy đủ tính năng:

- ✅ TypeScript types và interfaces
- ✅ API service layer 
- ✅ Zustand state management
- ✅ Custom React hooks
- ✅ UI components (AudioPlayer & AudioGeneration)
- ✅ WebSocket real-time integration
- ✅ StoryDetailPage integration

## 📁 Cấu trúc Files Đã Tạo

### Types & Interfaces
```
frontend/src/types/audio.types.ts
```
- Định nghĩa đầy đủ types cho audio functionality
- 30+ voice options với characteristics
- WebSocket event types
- UI state types

### API Service Layer
```
frontend/src/services/api/audio.api.ts
```
- REST API calls cho tất cả audio endpoints
- Axios interceptors cho authentication
- File download functionality
- Error handling

### State Management
```
frontend/src/store/audio.store.ts
```
- Zustand store cho audio state
- Player state management
- Generation progress tracking
- Audio chunks management

### Custom Hooks
```
frontend/src/hooks/useAudio.ts
frontend/src/hooks/useAudioWebSocket.ts
```
- `useAudioPlayerControls()` - Audio player functionality
- `useAudioGenerationControls()` - Audio generation controls
- `useStoryAudio()` - Story-specific audio management
- `useAudioPlaylist()` - Playlist functionality
- `useVoiceSelection()` - Voice management
- `useAudioWebSocket()` - Real-time WebSocket events

### UI Components
```
frontend/src/components/audio/AudioPlayer.tsx
frontend/src/components/audio/AudioGeneration.tsx
frontend/src/components/audio/index.ts
```

## 🎵 AudioPlayer Component

### Features
- ✅ Play/Pause/Stop controls
- ✅ Progress bar with seek functionality
- ✅ Volume control with mute
- ✅ Previous/Next chunk navigation
- ✅ Playlist view with all chunks
- ✅ Current chunk information display
- ✅ Responsive design

### Usage
```tsx
import AudioPlayer from '@/components/audio/AudioPlayer'

<AudioPlayer 
  storyId="story-id"
  showPlaylist={true}
  autoPlay={false}
/>
```

## 🎤 AudioGeneration Component

### Features
- ✅ Voice selection với 30+ options
- ✅ Voice grouping by style (bright, upbeat, informative, firm, specialized)
- ✅ Word per chunk configuration
- ✅ Real-time progress tracking
- ✅ Audio statistics display
- ✅ Error handling và retry
- ✅ Download all audio files
- ✅ Delete audio functionality

### Voice Options
- **Bright**: Zephyr, Autonoe
- **Upbeat**: Puck, Laomedeia  
- **Informative**: Charon, Rasalgethi
- **Firm**: Kore, Orus
- **Specialized**: Fenrir, Leda, và nhiều hơn...

### Usage
```tsx
import AudioGeneration from '@/components/audio/AudioGeneration'

<AudioGeneration 
  storyId="story-id"
  onAudioGenerated={() => {
    // Handle completion
  }}
/>
```

## 🔌 WebSocket Integration

### Socket Context Extension
Đã mở rộng `SocketContext` với audio events:
- `onAudioProcessing()` - Listen for audio events
- `joinAudioRoom()` - Join audio room cho story
- `leaveAudioRoom()` - Leave audio room

### WebSocket Events
```typescript
// Server -> Client Events
'audio-generation-progress'    // Progress updates
'audio-generation-completed'   // Chunk completion
'audio-generation-failed'      // Error handling
'audio-generation-status'      // Overall status
'audio-status-update'          // Status updates
'audio-status-error'           // Status errors
```

### Real-time Features
- ✅ Live progress tracking
- ✅ Automatic chunk refresh
- ✅ Error notifications
- ✅ Completion notifications
- ✅ Status synchronization

## 📱 StoryDetailPage Integration

### Updated Features
- ✅ AudioGeneration component integration
- ✅ AudioPlayer component integration
- ✅ WebSocket connection cho audio events
- ✅ Layout responsive với grid system
- ✅ Auto-refresh sau khi audio generation hoàn thành

### Layout
```tsx
{/* Audio Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <AudioGeneration storyId={id!} />
  <AudioPlayer storyId={id!} />
</div>
```

## 🧪 Testing Guide

### 1. Basic Audio Generation
```bash
# Start backend và frontend
cd backend && npm run dev
cd frontend && npm run dev
```

### 2. Test Flow
1. **Create Story**: Tạo story với content
2. **Navigate**: Đi đến story detail page
3. **Generate Audio**: 
   - Click "Generate Audio" button
   - Select voice (ví dụ: Zephyr - Energetic)
   - Set word per chunk (300-700)
   - Click "Start Generation"
4. **Monitor Progress**: Xem real-time progress qua WebSocket
5. **Play Audio**: Sau khi hoàn thành, sử dụng AudioPlayer
6. **Test Controls**: Play/pause, volume, seek, playlist

### 3. WebSocket Testing
- ✅ Kiểm tra browser DevTools Console cho WebSocket logs
- ✅ Test connection/disconnection
- ✅ Test real-time progress updates
- ✅ Test error handling

### 4. Voice Options Testing
- ✅ Test tất cả voice styles
- ✅ Test voice characteristics display
- ✅ Test voice selection persistence

### 5. Player Testing
- ✅ Test audio playback
- ✅ Test playlist navigation
- ✅ Test volume controls
- ✅ Test progress seeking
- ✅ Test responsive design

## 🔗 API Endpoints Integration

### Backend Endpoints Được Sử Dụng
```
POST /api/audio/generate/:storyId     - Queue audio generation
GET  /api/audio/status/:storyId       - Get generation status
GET  /api/audio/story/:storyId        - Get all audio chunks
GET  /api/audio/chunk/:storyId/:index - Get specific chunk
GET  /api/audio/download/:storyId     - Download ZIP file
DELETE /api/audio/story/:storyId      - Delete all chunks
```

### WebSocket Namespace
```
Default namespace với audio rooms: audio-story-{storyId}
```

## 🚀 Next Steps

### Potential Enhancements
1. **Audio Visualization**: Waveform display
2. **Playback Speed**: Variable speed control
3. **Bookmarks**: Save position in audio
4. **Offline Mode**: Cache audio files
5. **Batch Operations**: Multiple story audio generation
6. **Audio Effects**: Echo, reverb, filters
7. **Export Options**: MP3, WAV format selection
8. **Captions**: Synchronized text display

### Performance Optimizations
1. **Lazy Loading**: Load audio chunks on demand
2. **Caching**: Browser-based audio caching
3. **Compression**: Audio compression for faster loading
4. **Progressive Loading**: Stream audio while generating

## 🐛 Troubleshooting

### Common Issues
1. **WebSocket Connection**: Check VITE_SOCKET_URL environment variable
2. **Audio Playback**: Check browser audio permissions
3. **File Download**: Check browser download permissions
4. **Voice Loading**: Check API connectivity
5. **Token Authentication**: Check localStorage accessToken

### Debug Tools
- Browser DevTools Console
- Network tab cho API calls
- Application tab cho localStorage
- Audio element inspection

## 📊 Performance Metrics

### Expected Performance
- **Audio Generation**: 30-60 seconds per story
- **WebSocket Latency**: < 100ms
- **Audio Loading**: 2-5 seconds per chunk
- **UI Responsiveness**: < 100ms interactions

---

**✅ Audio Service Integration Complete!**

Tất cả components và functionality đã được tích hợp successfully. Frontend giờ đây có đầy đủ tính năng audio generation và playback với real-time updates qua WebSocket. 