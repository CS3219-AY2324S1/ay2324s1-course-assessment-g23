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
if [ "$(docker volume ls | grep nginx_logs)" == "" ]; then
    docker volume create nginx_logs
    docker run --rm -v nginx_logs:/nginx_logs nginx touch "./nginx_logs/access_file.log"
fi

# Remove CR (ie. \r) characters from `judge0.conf`, as judge0 server crashes if
# it does; and Git keeps adding them back when Git's `autocrlf` is set to "input".
sed -i 's/\r//g' "./backend_services/code_execution_service/judge0/judge0.conf"

# Rebuild and (re)start the services, removing orphan containers in the process.
docker compose --env-file .env up --build --remove-orphans "$@"
