#!/bin/bash

# Build and run Hyperledger Explorer with Docker

set -e

echo "Building Hyperledger Explorer Docker image..."

# Build the Docker image
docker build -t hyperledger-explorer .

echo "Docker image built successfully!"
echo ""
echo "To run the application with database:"
echo "  docker-compose up -d"
echo ""
echo "To run just the explorer container:"
echo "  docker run -p 8090:8080 hyperledger-explorer"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f explorer"
echo ""
echo "To stop the application:"
echo "  docker-compose down" 