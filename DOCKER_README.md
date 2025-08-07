# Docker Setup for AI Story Generator Frontend

This document provides instructions for running the AI Story Generator frontend application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

### Production Build

1. **Build and run the production version:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`

### Development Build (with Hot Reload)

1. **Build and run the development version:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`
   - Changes to your source code will automatically reload

## Docker Commands

### Production Commands

```bash
# Build and start production containers
docker-compose up --build

# Start containers in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild without cache
docker-compose build --no-cache
```

### Development Commands

```bash
# Build and start development containers
docker-compose -f docker-compose.dev.yml up --build

# Start development containers in background
docker-compose -f docker-compose.dev.yml up -d

# Stop development containers
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f
```

## Environment Configuration

1. **Copy the environment example file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the .env file with your configuration:**
   ```bash
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_SOCKET_URL=http://localhost:3001
   
   # App Configuration
   VITE_APP_NAME=AI Story Generator
   VITE_APP_VERSION=1.0.0
   ```

## Docker Images

### Production Image
- **Base:** `node:18-alpine` for build, `nginx:alpine` for runtime
- **Port:** 80 (mapped to host port 3000)
- **Features:** Optimized build, static file serving, gzip compression

### Development Image
- **Base:** `node:18-alpine`
- **Port:** 3000
- **Features:** Hot reloading, volume mounts for source code

## Architecture

```
┌─────────────────┐
│   Nginx (80)    │  ← Production
│   Static Files  │
└─────────────────┘

┌─────────────────┐
│   Vite Dev      │  ← Development
│   Server (3000) │
└─────────────────┘
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process or change the port in docker-compose.yml
   ```

2. **Build fails:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Hot reload not working:**
   - Ensure you're using the development docker-compose file
   - Check that volume mounts are correct
   - Verify file permissions

### Logs

```bash
# View container logs
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f frontend

# View nginx logs (production)
docker exec -it <container_name> tail -f /var/log/nginx/access.log
```

## Performance Optimization

### Production Optimizations
- Multi-stage build reduces image size
- Nginx serves static files efficiently
- Gzip compression enabled
- Static asset caching configured

### Development Optimizations
- Volume mounts for instant code changes
- Node modules cached in container
- Hot reloading enabled

## Security Considerations

- Non-root user in production container
- Security headers configured in nginx
- Content Security Policy enabled
- XSS protection headers

## Backend Integration

If you have a backend service, uncomment the backend service in `docker-compose.yml`:

```yaml
backend:
  image: your-backend-image
  ports:
    - "3001:3001"
  environment:
    - NODE_ENV=production
  networks:
    - app-network
  restart: unless-stopped
```

## Customization

### Changing Ports
Edit the `ports` section in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 3000 to your preferred port
```

### Environment Variables
Add environment variables to the `environment` section:
```yaml
environment:
  - NODE_ENV=production
  - VITE_API_BASE_URL=http://your-api-url
```

## Cleanup

```bash
# Remove all containers and images
docker-compose down --rmi all --volumes --remove-orphans

# Clean up Docker system
docker system prune -a
``` 