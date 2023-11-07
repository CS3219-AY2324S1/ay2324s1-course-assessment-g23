#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Directory of this script.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the below code relative to this script's directory.
cd "$SCRIPT_DIR"

# Check if volumes already exist, if not create them.
if [ "$(docker volume ls | grep users-data)" == "" ]; then
    docker volume create users-data
fi
if [ "$(docker volume ls | grep questions-data)" == "" ]; then
    docker volume create questions-data
fi

# Stop any currently-running services.
docker compose down --remove-orphans

# Rebuild and start the services.
docker compose --env-file .env up --build "$@"
