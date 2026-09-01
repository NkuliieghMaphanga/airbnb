# Airbnb Clone – Backend API

Node.js / Express / MongoDB backend for the Zaio Full Stack Developer Boot Camp Capstone project.
Handles accommodation listings, reservations, JWT-based user authentication, and admin management.

## Tech Stack

| Package | Purpose |
|---|---|
| **Node.js** + **Express.js** | REST API framework |
| **MongoDB** + **Mongoose** | Database and ODM |
| **JWT** (`jsonwebtoken`) | Authentication tokens |
| **bcryptjs** | Password hashing (salt rounds 10) |
| **Multer** | Image file upload handling |
| **Helmet** | Secure HTTP response headers |
| **express-rate-limit** | Brute-force protection on auth endpoints |
| **CORS**, **Morgan**, **dotenv** | Supporting middleware |

## Project Structure

```
airbnb-backend/
├── config/
│   └── db.js                     # MongoDB connection helper
├── controllers/
│   ├── accommodationController.js # Accommodation CRUD logic
│   ├── adminController.js         # Admin-only operations (stats, user mgmt)
│   ├── reservationController.js   # Reservation CRUD + cost calculation
│   └── userController.js          # Auth (register / login / me)
├── models/
│   ├── Accommodation.js           # Mongoose schema with image & pricing fields
│   ├── Reservation.js             # Schema with server-computed totalCost
│   └── User.js                    # Schema with bcrypt pre-save hook
├── routes/
│   ├── accommodationRoutes.js     # /api/accommodations
│   ├── adminRoutes.js             # /api/admin  (admin role required)
│   ├── reservationRoutes.js       # /api/reservations
│   └── userRoutes.js              # /api/users
├── middleware/
│   ├── auth.js                    # protect (JWT verify) + authorize (role check)
│   ├── errorHandler.js            # Centralised error normalisation
│   └── upload.js                  # Multer config (jpeg/png/webp, 5 MB limit)
├── tests/
│   └── api.test.js                # Jest + Supertest integration tests
├── server.js                      # App entry point
├── seeder.js                      # Demo data seed script
├── Procfile                       # Heroku process file
└── .env.example                   # Environment variable template
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and fill in MONGO_URI and JWT_SECRET
   ```

3. **Seed demo data** (creates admin, host, and guest accounts + 8 sample listings):
   ```bash
   npm run seed
   ```

4. **Start the development server** (auto-restarts on file changes):
   ```bash
   npm run dev
   ```
   Or in production mode:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000/api`.

5. **Run tests:**
   ```bash
   npm test
   ```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port the server listens on (default `5000`) |
| `MONGO_URI` | **Yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | Secret used to sign JWTs — use a long random string |
| `JWT_EXPIRES_IN` | No | JWT expiry duration (default `7d`) |
| `CLIENT_URLS` | **Yes (prod)** | Comma-separated list of allowed CORS origins |
| `NODE_ENV` | No | Set to `production` on Heroku to disable dev logging |

> ⚠️ In production, always set `CLIENT_URLS` explicitly. If unset, the server will refuse all cross-origin requests in production mode.

## API Reference

All responses follow the envelope: `{ success: boolean, data | message, count?, details? }`.  
Protected routes require an `Authorization: Bearer <token>` header.

### Users – `/api/users`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new user account |
| POST | `/login` | Public | Authenticate and receive a JWT |
| GET | `/me` | Private | Get the logged-in user's profile |

### Accommodations – `/api/accommodations`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all accommodations (`?location=` filter) |
| GET | `/:id` | Public | Get a single accommodation |
| POST | `/` | Private (host/admin) | Create a listing — accepts JSON or multipart/form-data |
| PUT | `/:id` | Private (owner/admin) | Update a listing (whitelisted fields only) |
| DELETE | `/:id` | Private (owner/admin) | Delete a listing |

### Reservations – `/api/reservations`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Create a reservation (totalCost computed server-side) |
| GET | `/host` | Private (host/admin) | Reservations for the host's listings |
| GET | `/user` | Private | Reservations made by the current user |
| GET | `/:id` | Private (booker/host/admin) | Get a single reservation |
| PATCH | `/:id/status` | Private (host/admin) | Update reservation status |
| DELETE | `/:id` | Private (booker/host/admin) | Cancel/delete a reservation |

### Admin – `/api/admin` *(all routes require admin role)*

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/stats` | Admin | Platform summary (users, listings, reservations, revenue) |
| GET | `/users` | Admin | List all registered users |
| PATCH | `/users/:id/role` | Admin | Change a user's role |
| DELETE | `/users/:id` | Admin | Delete a user account |
| GET | `/reservations` | Admin | List every reservation across all listings |

### Health Check

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Returns `{ success: true, message: "API is running" }` |

## Security

- **Helmet** sets secure HTTP headers on every response
- **Rate limiting** — auth endpoints capped at 20 req/15 min per IP; all other API routes capped at 300 req/15 min
- **JWT** with configurable secret and expiry; token validated against the DB on every protected request
- **bcrypt** with salt rounds 10 for password storage; `select: false` ensures password hash is never returned in queries
- **Field whitelisting** on update operations prevents clients from overwriting protected fields (`host`, `_id`)
- **Role-based access control** enforced at both the route level (`authorize` middleware) and controller level

## Deployment (Heroku)

1. Create a Heroku app and a MongoDB Atlas cluster.
2. Set the following config vars on Heroku:
   - `MONGO_URI` — Atlas connection string
   - `JWT_SECRET` — strong random secret
   - `JWT_EXPIRES_IN` — e.g. `7d`
   - `CLIENT_URLS` — your frontend URLs (comma-separated)
   - `NODE_ENV` — `production`
3. Push to Heroku:
   ```bash
   git push heroku main
   ```
   The included `Procfile` tells Heroku to run `node server.js`.

## Demo Credentials

Run `npm run seed` to populate the database with demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@airbnb.demo | Admin1234! |
| Host | host@airbnb.demo | Host1234! |
| Guest | user@airbnb.demo | User1234! |

---

*Built as part of the Zaio Full Stack Developer Boot Camp Capstone project.*
