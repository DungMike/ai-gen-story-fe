# AI Story Generator Frontend

A modern, intelligent, and intuitive frontend for the AI Story Generator application built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

### Modern Design
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Glass Morphism**: Modern glass effects and backdrop blur
- **Gradient Accents**: Beautiful gradient backgrounds and text effects
- **Smooth Animations**: Framer Motion powered animations and transitions

### User Experience
- **Intuitive Navigation**: Clean and organized navigation structure
- **Real-time Updates**: Live processing status and progress indicators
- **Smart Forms**: Form validation with helpful error messages
- **Loading States**: Skeleton screens and loading indicators
- **Toast Notifications**: Rich toast notifications for user feedback

### Authentication & User Management
- **Secure Login/Register**: JWT-based authentication with refresh tokens
- **Session Management**: Multiple device session tracking
- **User Profiles**: Complete profile management with avatar upload
- **Settings Panel**: User preferences and subscription management
- **Password Security**: Secure password change and reset functionality

### Story Processing
- **File Upload**: Drag-and-drop file upload with progress tracking
- **Real-time Processing**: Live progress updates for story generation
- **Audio Generation**: Text-to-speech with multiple voice options
- **Image Generation**: AI-powered illustrations with style customization
- **Batch Processing**: Bulk file processing with queue management

### Dashboard & Analytics
- **Statistics Cards**: Real-time statistics and metrics
- **Interactive Charts**: Processing timeline and genre distribution
- **Recent Activity**: Latest stories and processing jobs
- **Performance Metrics**: Processing time and success rate tracking

## 🛠️ Technology Stack

### Core Technologies
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **Framer Motion**: Animation library

### State Management & Data
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client for API calls
- **Socket.IO Client**: Real-time communication

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript**: Static type checking

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-story-generator/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_SOCKET_URL=http://localhost:3001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components
│   │   └── common/        # Common components
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── home/          # Home page
│   │   ├── dashboard/     # Dashboard pages
│   │   └── user/          # User management pages
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and service functions
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── lib/               # Library configurations
│   └── styles/            # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Secondary**: Purple accents
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Monospace**: JetBrains Mono for code

### Spacing
- **4px base unit**: Consistent spacing scale
- **Responsive breakpoints**: Mobile, tablet, desktop
- **Container max-widths**: Optimized for readability

### Components
- **Cards**: Elevated with subtle shadows
- **Buttons**: Multiple variants (default, outline, ghost, gradient)
- **Forms**: Clean input fields with validation
- **Modals**: Overlay dialogs with backdrop blur
- **Navigation**: Sticky header with smooth transitions

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Style
- **ESLint**: Enforces code quality
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Husky**: Pre-commit hooks

### Component Guidelines
- **Functional Components**: Use React hooks
- **TypeScript**: Strict typing for all components
- **Props Interface**: Define clear prop interfaces
- **Default Props**: Provide sensible defaults
- **Error Boundaries**: Handle component errors gracefully

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
VITE_APP_NAME=AI Story Generator
```

### Static Hosting
The built files can be deployed to:
- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop deployment
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for open source

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile-First Approach
- **Touch-friendly**: Large touch targets
- **Gesture support**: Swipe and pinch gestures
- **Offline capability**: Service worker for offline access
- **Performance**: Optimized for mobile networks

## 🔐 Security

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: Automatic token renewal
- **Session Management**: Multi-device session tracking
- **CSRF Protection**: Cross-site request forgery protection

### Data Protection
- **HTTPS Only**: Secure communication
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: Sanitized user inputs
- **CORS Configuration**: Proper cross-origin settings

## 📊 Performance

### Optimization
- **Code Splitting**: Lazy-loaded components
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Browser and service worker caching

### Monitoring
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Core Web Vitals
- **Analytics**: User behavior tracking
- **Uptime Monitoring**: Service availability

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

### Development Guidelines
- **Follow TypeScript**: Strict typing
- **Write Tests**: Unit and integration tests
- **Document Code**: Clear comments and documentation
- **Follow Git Flow**: Proper branching strategy

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check the docs folder
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub discussions
- **Email**: Contact the development team

---

Built with ❤️ using modern web technologies 