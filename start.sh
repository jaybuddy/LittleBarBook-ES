#!/bin/bash

# Define some constants for use later
IMAGE_NAME=jaybuddy/little-bar-book
CONTAINER_NAME=little-bar-book
WORKDIR="/home/nodejs/little-bar-book"

# Clean up any running containers
docker stop ${CONTAINER_NAME}
docker rm ${CONTAINER_NAME}

# Build the container
docker build -t ${IMAGE_NAME} .

# Start the container
docker run \
  -p 3000:3000 \
  --name ${CONTAINER_NAME} \
  -it ${IMAGE_NAME}