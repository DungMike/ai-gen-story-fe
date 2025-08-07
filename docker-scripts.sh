#!/bin/bash

# Docker Scripts for AI Story Generator Frontend
# Usage: ./docker-scripts.sh [command]

set -e

case "$1" in
  "start")
    echo "Starting the application in production mode..."
    docker compose up -d
    echo "Application is running at http://localhost:3000"
    ;;
  
  "start-dev")
    echo "Starting the application in development mode..."
    docker compose -f docker-compose.dev.yml up -d
    echo "Development server is running at http://localhost:3000"
    ;;
  
  "stop")
    echo "Stopping the application..."
    docker compose down
    ;;
  
  "stop-dev")
    echo "Stopping the development application..."
    docker compose -f docker-compose.dev.yml down
    ;;
  
  "restart")
    echo "Restarting the application..."
    docker compose restart
    ;;
  
  "logs")
    echo "Showing application logs..."
    docker compose logs -f
    ;;
  
  "logs-dev")
    echo "Showing development logs..."
    docker compose -f docker-compose.dev.yml logs -f
    ;;
  
  "build")
    echo "Building the application..."
    docker compose build --no-cache
    ;;
  
  "build-dev")
    echo "Building the development application..."
    docker compose -f docker-compose.dev.yml build --no-cache
    ;;
  
  "clean")
    echo "Cleaning up Docker resources..."
    docker compose down --rmi all --volumes --remove-orphans
    docker system prune -f
    ;;
  
  "status")
    echo "Checking container status..."
    docker compose ps
    ;;
  
  "shell")
    echo "Opening shell in the container..."
    docker compose exec frontend sh
    ;;
  
  "shell-dev")
    echo "Opening shell in the development container..."
    docker compose -f docker-compose.dev.yml exec frontend-dev sh
    ;;
  
  *)
    echo "Usage: $0 {start|start-dev|stop|stop-dev|restart|logs|logs-dev|build|build-dev|clean|status|shell|shell-dev}"
    echo ""
    echo "Commands:"
    echo "  start       - Start the application in production mode"
    echo "  start-dev   - Start the application in development mode"
    echo "  stop        - Stop the application"
    echo "  stop-dev    - Stop the development application"
    echo "  restart     - Restart the application"
    echo "  logs        - Show application logs"
    echo "  logs-dev    - Show development logs"
    echo "  build       - Build the application"
    echo "  build-dev   - Build the development application"
    echo "  clean       - Clean up Docker resources"
    echo "  status      - Check container status"
    echo "  shell       - Open shell in production container"
    echo "  shell-dev   - Open shell in development container"
    exit 1
    ;;
esac 