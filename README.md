# PeerPrep - CS3219 Grp 23

## Table of Contents

- [Getting Started](/README.md#getting-started)
  - [Local deployment](/README.md#local-deployment)
  - [Demo](/README.md#demo)
- [Requirements](/README.md#requirements)
- [Architecture](/README.md#architecture)
- [Services](/README.md#services)
- [API documentation](/README.md#api-documentation)
- [Database Structure](/README.md#database-structure)

## Getting Started

### Local deployment

1. Ensure you have docker and git installed on your device.
2. Clone code from this github repository.
3. Run `start_containers.sh` through the CLI and wait for all containers to start up.
4. You can access the application on `localhost` or `localhost:80`.

### Demo

### Assignment - 1

### Assignment - 2

### Assignment - 3

### Assignment - 4

### Assignment - 5

### Assignment - 6

## Requirements

### Functional Requirements

### Non-Functional Requirements

## Architecture

We're using the microservices architecture in this application. The services and their interactions are described in detail below.

### Frontend

### API Gateway

### Matching Service

### Questions Service

### Users Service

## API documentation

### API gateway

## Database Schema

### Users Database

#### users

|user_id (key) | username | password | email | role |
|-|-|-|-|-|

#### sessions

|session_id (key)|user_id|role|creation_time|expiration_time|
|-|-|-|-|-|

### Questions Database

### questions

|question_id (key)|title|description|category|complexity|
|-|-|-|-|-|
