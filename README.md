# Tech Challenge - User Management and Auth Microservice

This is a backend application whose purpose is to user management and authentication.

## Quick setup

* Clone the repo
* run `npm install`
* set the .env file as follows (**IMPORTANT**: a MongoDB Atlas instance is required)

```bash
PORT=<the port you prefer, if omitted the default will be 3000>
MONGODB_URI=mongodb+srv://<user_username>:<user_password>@<your_cluster>.mongodb.net/<database_name>
JWT_SECRET=<put a secret key for JWT signature>
```

* run `npm run start:dev` for local/development environment, or `npm run build && npm run start:prod` for production build


## Techonologies

* Nestjs to build the app
* MongoDB for data persistence


## Endpoints

Swagger is available [here](./openapi.yaml)

* POST /auth/register - Register a new user
* POST /auth/login - Authenticate a user and return an access token (or equivalent)
* GET /auth/users - Retrieve the list of users (protected endpoint). This endpoint must be accessible only to authenticated users
* GET /auth/me - Retrieve the currently authenticated user
* PUT /auth/users/:id - Update a user
* DELETE /auth/users/:id - Delete a user


## Environment for docker-compose

This is the .env to configure for docker-compose. replace the placeholders with actual variables.

```bash
# Auth Microservice Environment Configuration

# Application Settings
NODE_ENV=development
PORT=3000

# Database Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=StrongPassword123!
MONGO_DATABASE=authdb

# MongoDB Connection String (automatically constructed in docker-compose)
# MONGODB_URI will be set automatically by docker-compose

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Mongo Express (Database Admin Interface)
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASSWORD=admin123

# Development Settings
# Uncomment for development mode with hot reload
# COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml
```