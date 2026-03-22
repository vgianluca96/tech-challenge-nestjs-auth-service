# Tech Challenge - User Management and Auth Microservice

This is a backend application whose purpose is to manage user registration and authentication.

## Quick setup

* Clone the repo
* run `npm install`
* set the .env file as follows (**IMPORTANT**: a MongoDB Atlas instance is required)

```
PORT=<the port you prefer, if omitted the default will be 3000>
MONGODB_URI=mongodb+srv://<user_username>:<user_password>@<your_cluster>.mongodb.net/<database_name>
JWT_SECRET=<put a secret key for JWT signature>
```

* run `npm run start:dev` for local/development environment, or `npm run build && npm run start:prod` for production build


## Techonologies

* Nestjs to build the app
* MongoDB for data persistence


## Endpoints

* POST /auth/register - Register a new user
* POST /auth/login - Authenticate a user and return an access token (or equivalent)
* GET /auth/users - Retrieve the list of users (protected endpoint). This endpoint must be accessible only to authenticated users
* GET /auth/me - Retrieve the currently authenticated user
* PUT /auth/users/:id - Update a user
* DELETE /auth/users/:id - Delete a user
