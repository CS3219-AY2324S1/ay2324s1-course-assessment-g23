# PeerPrep - CS3219 Grp 23

## Table of Contents

- [Getting Started](/README.md#getting-started)
  - [Local deployment](/README.md#local-deployment)
  - [Demo](/README.md#demo)
- [Requirements](/README.md#requirements)
- [Architecture](/README.md#architecture)

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

<img src="/diagrams/architecture.drawio.png" />

All microservices are deployed as microservice within a docker container

### Frontend

Responsible for web UI and user interaction.

Technology: React

Communication: Send REST requests to API Gateway.

### Backend Services

### API Gateway

Acts as a gateway between frontend and the rest of the backend services.

Technology: Python

Communication: Expose endpoints to get REST API calls from frontend. Forwards them to Users, Questions and Matching Service APIS.

### Users Service

Keeps track of the users and the currently open sessions. We use sessions to keep track of whether a user is currently logged in or not.

Technology: Python

Communication: with API Gateway via REST API

 | Method | Endpoint | Request Body | Response Body | Errors | Description |
 | - | - | - | - | - | - |
 | POST | /users | {username: str,<br> password: str, <br> email: str} | {message: str}| 500: Internal error, try again <br> 409: Username already exists <br> 409: Email already exists | Creates a new user (Sign up) |
 | GET | /users/{user_id: str} |  | {user_id: str, <br> username: str, <br> email: str, <br> role: str}| |Returns data of a specified user |
 | DELETE | /users/{user_id: str}| | {message: str} | 404: User doesn't exist <br> 403: Cannot delete last maintainer | Deletes specified user |
 | PUT | /users/{user_id}| {username: Optional[str], <br> password: Optional[str], email: Optional[str]} | {message: str} | 404: User does not exist <br> 409: Username already exists <br> 409: Email already exists | Updates data of specified user |
 | PUT | /users_role/{user_id: str} | {role: str}| {message: str} | 409: Only one maintainer left | Updates user role of specified user.
 | GET | /users_all| | [{user_id: str, <br> username: str, <br> email: str, <br> role: str}] | |Returns list of all users |
 | DELETE | /users_all | | {message: str}| | Deletes all users |
 | POST | /sessions| {username: str, <br> password: str} | {session_id: str, <br> message: str} | 401: Invalid Password <br> 401: Account does not exist | Login |
 | GET | /sessions/{session_id}| | {session_id: str, <br> user_id: str, <br> role: str, <br> creation_time: str, <br> expiration_time: str} | 401: Unauthorized Session | Returns information for a specified open session |
 | DELETE | /sessions/{session_id}| | {message: str} | 500: Unable to log out user | Logout |
 | GET | /sessions_all| | [{session_id: str, <br> user_id: str, <br> role: str, <br> creation_time: str, <br> expiration_time: str}] | | Returns list of all open sessions |

#### Users Database

Uses PostgreSQL. Schema:

#### users

 | user_id (key) | username | password | email | role |
 | - | - | - | - | - |

#### sessions

 | session_id (key) | user_id | role | creation_time | expiration_time |
 | - | - | - | - | - |

<br>

### Questions Service

Keeps track of all questions for application.

Technology: Python

Communication: with API Gateway via REST API

| Method | Endpoint | Request Body | Response Body | Errors | Description |
| - | - | - | - | - | - |
| POST | /questions | {title: str, <br> description: str, <br> category: str, <br> complexity: str} | {message: str} | 422: Invalid value for complexity. Complexity must be Easy, Medium or Hard <br> 500: Internal server error (try again) <br> 409: Title already exists | Creates a new question |
| GET | /questions/{question_id} | | {question_id: str} | 404: Question id does not exist | Returns information for a specified question
| GET | /questions_all | | [{question_id: str}] | | Returns a list of all questions in database |
| PUT | /questions | {question_id: str, <br> title: str, <br> description: str, <br> category: str, <br> complexity: str} | {message: str} | 404: Question does not exist <br> 409: Title already exists <br> 422: Invalid value for complexity. Complexity must only be Easy, Medium, or Hard | Update information of questions |
| DELETE | /questions/{question_id} | | {message: str} | 404: Question does not exist | Deletes a specified question |

#### Questions Database

Uses PostgreSQL. Schema:

#### questions

 | question_id (key) | title | description | category | complexity |
 | - | - | - | - | - |

<br>

### Matching Service

Matching two users to solve questions together.

Technology: Python

Communication: 

#### RMQ Server

Creates 3 queues according to complexity. People in the same queue are matched toegther.

complexity_queues:

1. easy_queue
2. medium_queue
3. hard_queue
