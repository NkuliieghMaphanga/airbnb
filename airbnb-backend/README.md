# Airbnb Clone – Backend API

Node.js / Express / MongoDB backend for the Zaio Full Stack Developer Boot Camp Capstone project.
Handles accommodation listings, reservations, and JWT-based user authentication.

## Tech Stack

- **Node.js** + **Express.js** – REST API
- **MongoDB** + **Mongoose** – database and ODM
- **JWT** (`jsonwebtoken`) – authentication
- **bcryptjs** – password hashing
- **Multer** – optional image upload handling
- **CORS**, **Morgan**, **dotenv** – supporting middleware

## Project Structure

```
airbnb-backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── accommodationController.js
│   ├── reservationController.js
│   └── userController.js
├── models/
│   ├── Accommodation.js
│   ├── Reservation.js
│   └── User.js
├── routes/
│   ├── accommodationRoutes.js
│   ├── reservationRoutes.js
│   └── userRoutes.js
├── middleware/
│   ├── auth.js                  # JWT protect + role-based authorize
│   ├── errorHandler.js          # centralized error handling
│   └── upload.js                # multer config for image uploads
├── server.js
├── Procfile                      # Heroku process file
└── .env.example
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your own `MONGO_URI` and `JWT_SECRET`:
   ```bash
   cp .env.example .env
   ```
3. Run in development (with auto-restart):
   ```bash
   npm run dev
   ```
   Or in production mode:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000/api`.

## Environment Variables

| Variable         | Description                                             |
|------------------|-----------------------------------------------------------|
| `PORT`           | Port the server listens on (default `5000`)               |
| `MONGO_URI`      | MongoDB connection string                                  |
| `JWT_SECRET`     | Secret used to sign JWTs                                   |
| `JWT_EXPIRES_IN` | JWT expiry, e.g. `7d`                                       |
| `CLIENT_URLS`    | Comma-separated list of allowed frontend origins for CORS  |

## API Reference

All responses follow the shape `{ success: boolean, data | message, ... }`.
Protected routes require an `Authorization: Bearer <token>` header.

### Users – `/api/users`

| Method | Route              | Access  | Description                          |
|--------|--------------------|---------|---------------------------------------|
| POST   | `/register`        | Public  | Create a new user account             |
| POST   | `/login`           | Public  | Authenticate and receive a JWT        |
| GET    | `/me`               | Private | Get the logged-in user's profile      |

### Accommodations – `/api/accommodations`

| Method | Route  | Access            | Description                                  |
|--------|--------|-------------------|-----------------------------------------------|
| GET    | `/`    | Public            | List all accommodations (`?location=` filter) |
| GET    | `/:id` | Public            | Get a single accommodation                    |
| POST   | `/`    | Private (host)    | Create a listing (multipart for image upload) |
| PUT    | `/:id` | Private (owner)   | Update a listing                              |
| DELETE | `/:id` | Private (owner)   | Delete a listing                              |

### Reservations – `/api/reservations`

| Method | Route    | Access  | Description                                 |
|--------|----------|---------|-----------------------------------------------|
| POST   | `/`      | Private | Create a reservation                          |
| GET    | `/host`  | Private | Reservations for the logged-in host's listings|
| GET    | `/user`  | Private | Reservations made by the logged-in user       |
| DELETE | `/:id`   | Private | Cancel/delete a reservation                   |

## Deployment (Heroku)

1. Create a Heroku app and a MongoDB Atlas cluster.
2. Set the `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URLS` config vars on Heroku.
3. Push to Heroku (`git push heroku main`). The included `Procfile` tells Heroku to run `node server.js`.

## Author

Built as part of the Zaio Full Stack Developer Boot Camp Capstone project.
