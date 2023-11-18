#!/bin/bash

# Use the provided PYTHON_PATH or default to the system's Python
PYTHON_PATH="${PYTHON_PATH:-$(which python)}"

# Run formatter commands in the background and collect their PIDs
$PYTHON_PATH -m autoflake --check "$@" &
pid_autoflake=$!
$PYTHON_PATH -m black --check "$@" &
pid_black=$!
$PYTHON_PATH -m isort --check-only "$@" &
pid_isort=$!

# Store all the PIDs in an array
pids=($pid_autoflake $pid_black $pid_isort)

# Function to kill all running jobs
kill_jobs() {
  echo "An error occurred. Exiting and killing background jobs..."
  kill "${pids[@]}" 2>/dev/null
}

# Trap signals and errors to cleanup background jobs
trap 'kill_jobs; exit 1;' ERR SIGINT SIGTERM

# Wait for all jobs to complete and exit if any fails
for pid in "${pids[@]}"; do
  wait "$pid" || { kill_jobs; exit 1; }
done

echo "All formatting checks passed."
exit 0
