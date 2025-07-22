# Frontend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_SOCKET_URL=http://localhost:3001
   VITE_APP_NAME=AI Story Generator
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
├── types/         # TypeScript types
├── lib/           # Utility functions
└── styles/        # Global styles
```

## Features

- ✅ Modern React 18 + TypeScript
- ✅ Tailwind CSS + shadcn/ui
- ✅ Dark/Light mode support
- ✅ Responsive design
- ✅ Real-time updates (Socket.IO)
- ✅ Form validation
- ✅ File upload
- ✅ Authentication system
- ✅ Dashboard & analytics

## Next Steps

1. Connect to backend API
2. Implement authentication
3. Add real-time features
4. Deploy to production 