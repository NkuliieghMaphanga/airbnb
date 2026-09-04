# Airbnb Clone – Full Stack Web Application

A full-stack Airbnb clone developed as part of the **Zaio Full Stack Developer Boot Camp Capstone Project**.

The project is designed to provide a functional accommodation-booking platform with a React frontend, Node.js/Express backend, MongoDB database, JWT authentication, accommodation management, reservations, and a dedicated admin dashboard.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Project Objectives](#project-objectives)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
* [Application Structure](#application-structure)
* [User Roles](#user-roles)
* [Frontend Features](#frontend-features)
* [Admin Dashboard](#admin-dashboard)
* [Backend API](#backend-api)
* [Authentication and Authorization](#authentication-and-authorization)
* [Accommodation Management](#accommodation-management)
* [Reservation System](#reservation-system)
* [Cost Calculator](#cost-calculator)
* [Image Uploads](#image-uploads)
* [API Endpoints](#api-endpoints)
* [Environment Variables](#environment-variables)
* [Installation](#installation)
* [Running the Application](#running-the-application)
* [Seeding Demo Data](#seeding-demo-data)
* [Testing](#testing)
* [Security](#security)
* [Error Handling](#error-handling)
* [Deployment](#deployment)
* [Project Rubric Coverage](#project-rubric-coverage)
* [Future Improvements](#future-improvements)
* [Author](#author)

---

# Project Overview

This project is a full-stack Airbnb-inspired accommodation booking platform.

The application allows users to browse accommodation listings, view detailed property information, calculate reservation costs, and create reservations.

Hosts and administrators have additional functionality for managing accommodation listings and reservations.

The project also includes a dedicated **Admin Dashboard** where administrators can authenticate securely and manage listings, users, reservations, and platform statistics.

The application consists of three main parts:

1. **Airbnb Frontend** – React-based customer-facing application.
2. **Admin Dashboard** – React-based administration interface.
3. **Backend API** – Node.js, Express, and MongoDB REST API.

---

# Project Objectives

The main objectives of the project are to:

* Build a responsive Airbnb-style frontend using React.
* Create reusable and modular React components.
* Implement accommodation browsing and filtering.
* Display detailed accommodation information.
* Implement a dynamic reservation cost calculator.
* Allow authenticated users to create reservations.
* Build secure JWT-based authentication.
* Create CRUD functionality for accommodation listings.
* Develop a dedicated admin dashboard.
* Implement role-based access control.
* Store application data using MongoDB and Mongoose.
* Handle image uploads using Multer.
* Implement API validation and error handling.
* Protect the API using security middleware.
* Test important API functionality.
* Prepare the application for production deployment.

---

# Key Features

## Customer Features

* Airbnb-style homepage.
* Hero banner with call-to-action.
* Inspiration destination cards.
* Airbnb Experiences sections.
* Things to do on your trip section.
* Things to do at home section.
* ShopAirbnb section.
* Future getaways section with tabs.
* Location filtering.
* Accommodation cards.
* Accommodation detail pages.
* Image galleries.
* Accommodation ratings and reviews.
* Amenities display.
* Guest and bedroom information.
* Dynamic reservation cost calculator.
* Date selection.
* Guest selection.
* Reservation creation.
* User authentication.
* User profile menu.
* Reservation history.
* Responsive design.

## Host Features

* Host authentication.
* Host-specific accommodation management.
* Create accommodation listings.
* Update owned listings.
* Delete owned listings.
* View reservations for hosted properties.

## Admin Features

* Secure admin login.
* Admin dashboard.
* Platform statistics.
* View all users.
* Change user roles.
* Delete user accounts.
* View all reservations.
* Create accommodation listings.
* View accommodation listings.
* Update accommodation listings.
* Delete accommodation listings.
* Image upload support.
* Protected admin routes.

---

# Technology Stack

| Technology         | Purpose                          |
| ------------------ | -------------------------------- |
| React.js           | Frontend user interface          |
| CSS                | Styling and responsive design    |
| Node.js            | Backend runtime                  |
| Express.js         | REST API framework               |
| MongoDB            | Database                         |
| Mongoose           | MongoDB ODM                      |
| JWT                | Authentication and authorization |
| bcryptjs           | Password hashing                 |
| Multer             | Image upload handling            |
| Helmet             | HTTP security headers            |
| express-rate-limit | Rate limiting                    |
| CORS               | Cross-origin request handling    |
| Morgan             | HTTP request logging             |
| dotenv             | Environment configuration        |
| Jest               | Testing framework                |
| Supertest          | API integration testing          |

---

# Application Structure

The project is separated into frontend, admin, and backend applications.

```text
airbnb-clone/
│
├── airbnb-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── airbnb-admin/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   │
│   └── package.json
│
└── airbnb-backend/
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   ├── accommodationController.js
    │   ├── adminController.js
    │   ├── reservationController.js
    │   └── userController.js
    │
    ├── models/
    │   ├── Accommodation.js
    │   ├── Reservation.js
    │   └── User.js
    │
    ├── routes/
    │   ├── accommodationRoutes.js
    │   ├── adminRoutes.js
    │   ├── reservationRoutes.js
    │   └── userRoutes.js
    │
    ├── middleware/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   └── upload.js
    │
    ├── tests/
    │   └── api.test.js
    │
    ├── server.js
    ├── seeder.js
    ├── Procfile
    ├── .env.example
    └── package.json
```

---

# User Roles

The application supports role-based access control.

| Role       | Permissions                                                             |
| ---------- | ----------------------------------------------------------------------- |
| Guest/User | Browse listings, authenticate, make reservations, view own reservations |
| Host       | Manage owned listings and view reservations for hosted properties       |
| Admin      | Manage users, listings, reservations, and platform statistics           |

Protected functionality requires a valid JWT.

Administrative functionality additionally requires the authenticated user to have the `admin` role.

---

# Frontend Features

## Home Page

The homepage contains the main Airbnb-style landing experience.

### Hero Banner

The hero section contains:

* Large visual banner.
* Clear heading.
* Supporting text.
* Call-to-action.
* Search/filter functionality.

### Inspiration Section

Displays destination/location cards containing:

* Location image.
* Location name.
* Supporting information.
* Navigation to the selected location.

### Discover Airbnb Experiences

The application includes separate experience sections:

* Things to do on your trip.
* Things to do at home.

Each section contains a clear heading, supporting visual content, and a call-to-action.

### ShopAirbnb

The ShopAirbnb section contains:

* Section heading.
* Call-to-action button.
* Gift-card visual.

### Future Getaways

The Future Getaways section contains tab-based content that allows users to switch between different categories.

### Footer

The footer contains:

* Navigation links.
* Information links.
* Social links.
* Language selection.
* Currency selection.
* Copyright information.

---

# Location Page

The Location page displays accommodation results based on the selected destination.

Each accommodation card can display:

* Property image.
* Accommodation type.
* Property name.
* Amenities.
* Rating.
* Number of reviews.
* Price per night.
* Location information.

The location page also displays:

* Selected location.
* Number of available accommodations.
* Location filter.

Selecting an accommodation navigates the user to the corresponding details page.

---

# Location Details Page

The accommodation details page provides comprehensive information about the selected property.

It includes:

* Accommodation type.
* Location.
* Property title.
* Rating.
* Review count.
* Image gallery.
* Description.
* Accommodation details.
* Bedroom information.
* Amenities.
* Host information.
* Reviews.
* House rules.
* Health and safety information.
* Cancellation policy.

---

# Image Gallery

The image gallery follows an Airbnb-inspired layout.

It includes:

* One large primary image.
* Four smaller supporting images.
* Responsive image layout.

Accommodation images can be stored and returned through the backend.

---

# Cost Calculator

The reservation calculator dynamically calculates the estimated booking cost.

The calculation includes:

```text
Nightly Price × Number of Nights
        ↓
Weekly Discount
        ↓
Cleaning Fee
        ↓
Service Fee
        ↓
Occupancy Taxes
        ↓
Final Reservation Cost
```

The calculator updates according to:

* Check-in date.
* Check-out date.
* Number of nights.
* Number of guests.
* Property price.
* Applicable discounts.
* Additional fees.

The final `totalCost` is calculated server-side when a reservation is created to prevent clients from manipulating the reservation price.

---

# Admin Dashboard

The Admin Dashboard is a separate interface designed specifically for administrators.

## Admin Header

The header includes:

* Airbnb branding.
* Navigation.
* Logged-in administrator greeting.
* Profile dropdown.
* Reservation access.
* Logout functionality.

When a user is not authenticated, the application provides the appropriate authentication or host-related navigation.

---

# Admin Login

The login page contains:

* Email input.
* Password input.
* Input validation.
* Error messages.
* Loading feedback.
* JWT authentication.

After successful authentication, the administrator is redirected to the Admin Dashboard.

Unauthorized users cannot access protected admin pages.

---

# Create Listing

Administrators and authorized hosts can create accommodation listings.

The form supports:

* Title.
* Location.
* Description.
* Bedrooms.
* Bathrooms.
* Maximum guests.
* Accommodation type.
* Price per night.
* Amenities.
* Images.
* Weekly discount.
* Cleaning fee.
* Service fee.
* Occupancy taxes.

Validation prevents invalid or incomplete information from being submitted.

---

# View Listings

The listings page displays accommodation properties with key information such as:

* Property title.
* Location.
* Price.
* Main image.
* Accommodation details.

Administrators can:

* View listings.
* Edit listings.
* Delete listings.

The page is designed to remain usable across different screen sizes.

---

# Update Listing

The update page uses the existing accommodation data to pre-populate the form.

Administrators can modify listing information and submit the changes.

After a successful update:

1. The backend validates the request.
2. The database is updated.
3. The updated accommodation is returned.
4. The frontend refreshes the relevant information.

Protected fields such as the listing owner and database ID cannot be arbitrarily overwritten.

---

# User Authentication

Authentication is implemented using JSON Web Tokens.

The authentication process is:

```text
User enters credentials
        ↓
POST /api/users/login
        ↓
Backend validates credentials
        ↓
Password checked using bcrypt
        ↓
JWT generated
        ↓
Token returned to frontend
        ↓
Frontend stores authentication state
        ↓
Token included in protected API requests
```

Protected requests use:

```http
Authorization: Bearer <token>
```

---

# Backend API

The backend is a RESTful API built using Node.js and Express.

The API provides:

* Authentication.
* Accommodation management.
* Reservation management.
* User management.
* Admin management.
* Health checking.

API responses follow a consistent structure:

```json
{
  "success": true,
  "data": {},
  "count": 1
}
```

Error responses use the same general response structure:

```json
{
  "success": false,
  "message": "An error occurred"
}
```

---

# API Endpoints

## Authentication

Base route:

```text
/api/users
```

| Method | Endpoint    | Access  | Description         |
| ------ | ----------- | ------- | ------------------- |
| POST   | `/register` | Public  | Register a user     |
| POST   | `/login`    | Public  | Authenticate a user |
| GET    | `/me`       | Private | Get current user    |

---

## Accommodations

Base route:

```text
/api/accommodations
```

| Method | Endpoint | Access      | Description            |
| ------ | -------- | ----------- | ---------------------- |
| GET    | `/`      | Public      | Get all accommodations |
| GET    | `/:id`   | Public      | Get one accommodation  |
| POST   | `/`      | Host/Admin  | Create accommodation   |
| PUT    | `/:id`   | Owner/Admin | Update accommodation   |
| DELETE | `/:id`   | Owner/Admin | Delete accommodation   |

Location filtering is supported through:

```text
GET /api/accommodations?location=New York
```

---

## Reservations

Base route:

```text
/api/reservations
```

| Method | Endpoint      | Access     | Description                     |
| ------ | ------------- | ---------- | ------------------------------- |
| POST   | `/`           | Private    | Create reservation              |
| GET    | `/host`       | Host/Admin | Get host reservations           |
| GET    | `/user`       | Private    | Get current user's reservations |
| GET    | `/:id`        | Private    | Get reservation                 |
| PATCH  | `/:id/status` | Host/Admin | Update reservation status       |
| DELETE | `/:id`        | Private    | Cancel/delete reservation       |

---

## Admin

Base route:

```text
/api/admin
```

All admin endpoints require the `admin` role.

| Method | Endpoint          | Access | Description           |
| ------ | ----------------- | ------ | --------------------- |
| GET    | `/stats`          | Admin  | Platform statistics   |
| GET    | `/users`          | Admin  | List users            |
| PATCH  | `/users/:id/role` | Admin  | Change user role      |
| DELETE | `/users/:id`      | Admin  | Delete user           |
| GET    | `/reservations`   | Admin  | List all reservations |

---

# Health Check

The API includes a health-check endpoint:

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "API is running"
}
```

This endpoint can be used to verify that the backend server is running correctly.

---

# Accommodation Data

An accommodation contains information such as:

```json
{
  "title": "Modern Apartment in New York",
  "location": "New York",
  "type": "Entire apartment",
  "guests": 4,
  "bedrooms": 2,
  "bathrooms": 2,
  "amenities": [
    "wifi",
    "kitchen",
    "free parking"
  ],
  "rating": 4.5,
  "reviews": 320,
  "price": 320,
  "weeklyDiscount": 0,
  "cleaningFee": 50,
  "serviceFee": 50,
  "occupancyTaxes": 30,
  "description": "Stay in the heart of New York City..."
}
```

---

# Reservation System

Reservations are linked to:

* The authenticated user.
* The selected accommodation.
* The host.
* Reservation dates.
* Number of guests.
* Calculated total cost.
* Reservation status.

The server calculates the total cost rather than trusting a price supplied by the frontend.

This protects the application against client-side price manipulation.

---

# Database Models

## User

The User model contains information such as:

* Username.
* Email.
* Password hash.
* Role.

Passwords are hashed using bcrypt before being stored.

---

## Accommodation

The Accommodation model contains:

* Property information.
* Location.
* Images.
* Pricing.
* Fees.
* Amenities.
* Host reference.
* Ratings.
* Description.

---

## Reservation

The Reservation model contains:

* User reference.
* Accommodation reference.
* Host reference.
* Check-in date.
* Check-out date.
* Guest count.
* Reservation status.
* Server-calculated total cost.

---

# Image Uploads

Multer is used to handle accommodation image uploads.

Supported formats include:

* JPEG.
* PNG.
* WebP.

The upload middleware limits image files to **5 MB**.

Example:

```text
Maximum file size: 5 MB
Supported formats: JPEG, PNG, WebP
```

Image uploads are available for accommodation creation and updates where supported by the frontend.

---

# Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_secret

JWT_EXPIRES_IN=7d

CLIENT_URLS=http://localhost:5173,http://localhost:5174

NODE_ENV=development
```

| Variable         | Required   | Description                                |
| ---------------- | ---------- | ------------------------------------------ |
| `PORT`           | No         | Backend server port. Defaults to `5000`.   |
| `MONGO_URI`      | Yes        | MongoDB Atlas connection string.           |
| `JWT_SECRET`     | Yes        | Secret used to sign JWTs.                  |
| `JWT_EXPIRES_IN` | No         | JWT expiration duration. Defaults to `7d`. |
| `CLIENT_URLS`    | Production | Allowed frontend CORS origins.             |
| `NODE_ENV`       | No         | Application environment.                   |

### Important Security Note

Never commit `.env` to GitHub.

Use `.env.example` to document the required environment variables without exposing credentials.

In production, `CLIENT_URLS` should be explicitly configured. Cross-origin requests should not be opened to arbitrary origins.

---

# Installation

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

Move into the project:

```bash
cd airbnb-clone
```

---

## 2. Install Backend Dependencies

```bash
cd airbnb-backend
npm install
```

---

## 3. Configure Environment Variables

Copy the environment template:

```bash
cp .env.example .env
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env
```

Update `.env` with your MongoDB and JWT configuration.

---

## 4. Install Frontend Dependencies

From the frontend directory:

```bash
npm install
```

---

## 5. Install Admin Dashboard Dependencies

From the admin dashboard directory:

```bash
npm install
```

---

# Running the Application

The backend development server can be started with:

```bash
npm run dev
```

The production server can be started with:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api
```

The frontend and admin dashboard should be started using their respective development commands.

For Vite-based React applications:

```bash
npm run dev
```

---

# Seeding Demo Data

The backend includes a seed script for creating demonstration data.

Run:

```bash
npm run seed
```

The seed script creates:

* Admin account.
* Host account.
* Guest account.
* Sample accommodation listings.

This allows the application to be tested without manually creating every record.

---

# Demo Credentials

After running the seed command, the following demo accounts can be used:

| Role  | Email               | Password     |
| ----- | ------------------- | ------------ |
| Admin | `admin@airbnb.demo` | `Admin1234!` |
| Host  | `host@airbnb.demo`  | `Host1234!`  |
| Guest | `user@airbnb.demo`  | `User1234!`  |

**Important:** These credentials are intended for local/demo testing only. Production applications should use unique, strong credentials.

---

# Testing

The backend includes Jest and Supertest integration tests.

Run:

```bash
npm test
```

Testing should cover important API functionality including:

* Health check.
* User registration.
* User login.
* Authentication.
* Accommodation retrieval.
* Accommodation creation.
* Accommodation updates.
* Accommodation deletion.
* Reservation creation.
* Reservation retrieval.
* Reservation deletion.
* Authorization.
* Invalid request handling.

---

# Security

Security was considered throughout the backend implementation.

## Helmet

Helmet is used to add security-related HTTP headers.

## Password Hashing

Passwords are hashed using bcrypt with salt rounds of 10.

Plain-text passwords are never stored in the database.

## JWT Authentication

JWTs are used to authenticate protected API requests.

Protected requests require:

```http
Authorization: Bearer <token>
```

## Role-Based Access Control

The application distinguishes between:

* User.
* Host.
* Admin.

Admin functionality is restricted using role-based authorization.

## Rate Limiting

Authentication endpoints are protected with rate limiting to reduce brute-force login attempts.

Authentication endpoints are limited to:

```text
20 requests per 15 minutes per IP
```

General API routes are limited to:

```text
300 requests per 15 minutes per IP
```

## CORS

CORS is configured to allow requests only from approved frontend origins.

## Field Whitelisting

Update operations use whitelisted fields to prevent clients from modifying protected values such as:

* `_id`
* `host`

## Environment Secrets

Sensitive information such as:

* MongoDB credentials.
* JWT secrets.
* Production configuration.

is stored using environment variables instead of being hard-coded.

---

# Error Handling

The backend uses centralized error handling.

Errors are converted into consistent API responses.

Example:

```json
{
  "success": false,
  "message": "Accommodation not found"
}
```

Appropriate HTTP status codes are used where applicable, including:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

The frontend also provides user-friendly feedback when API requests fail.

---

# Navigation and Routing

The React applications use client-side routing to provide navigation between views.

The main customer-facing routes include:

```text
/
 /locations
 /locations/:id
 /login
 /reservations
```

The Admin Dashboard includes routes for:

```text
/login
/dashboard
/listings
/listings/create
/listings/:id/edit
/reservations
/users
```

Routes are protected where authentication is required.

---

# Responsive Design

The application is designed to work across:

* Desktop computers.
* Laptops.
* Tablets.
* Mobile devices.

Responsive styling is applied to:

* Navigation.
* Accommodation cards.
* Image galleries.
* Forms.
* Tables.
* Dashboard components.
* Cost calculator.
* Footer.
* Homepage sections.

---

# Code Quality

The project follows a modular architecture.

Backend responsibilities are separated into:

```text
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
```

This separation makes the application:

* Easier to understand.
* Easier to test.
* Easier to maintain.
* Easier to extend.
* More reusable.

Frontend functionality is also divided into reusable components, pages, services, and hooks where appropriate.

---

# Deployment

The backend can be deployed to a service such as Heroku with MongoDB Atlas used as the production database.

## Production Environment Variables

Configure:

```env
MONGO_URI=your_production_mongodb_uri

JWT_SECRET=your_production_secret

JWT_EXPIRES_IN=7d

CLIENT_URLS=https://your-frontend-url.com

NODE_ENV=production
```

## Heroku Deployment

Create the application and configure the required environment variables.

Then deploy:

```bash
git push heroku main
```

The included `Procfile` instructs the hosting platform to run:

```text
node server.js
```

---

# Project Rubric Coverage

The implementation is designed around the Zaio assessment requirements.

## Frontend – 140 Marks

| Requirement          | Implementation                                 |
| -------------------- | ---------------------------------------------- |
| Hero Banner          | Hero section with CTA                          |
| Inspiration          | Destination cards                              |
| Discover Experiences | Experience sections with titles and buttons    |
| ShopAirbnb           | Image, title and CTA                           |
| Future Getaways      | Functional tab interface                       |
| Footer               | Organized links and supporting controls        |
| Location Filter      | Dynamic accommodation filtering                |
| Location Cards       | Property information and navigation            |
| Location Details     | Heading and supporting information             |
| Image Gallery        | Large image + four supporting images           |
| Cost Calculator      | Dynamic reservation calculation                |
| Static Information   | Accommodation, host, rules and policy sections |
| Header               | Logo, filter and profile functionality         |
| Code Quality         | Modular React architecture                     |

---

# Admin Dashboard Rubric Coverage

The Admin Dashboard addresses the following assessment requirements:

| Requirement    | Implementation                               |
| -------------- | -------------------------------------------- |
| Header         | Logo, navigation, greeting and profile menu  |
| Login          | Email/password authentication and validation |
| Create Listing | Complete listing form                        |
| Image Upload   | Multipart image handling                     |
| View Listings  | Listing cards/table with actions             |
| Update Listing | Pre-filled edit form                         |
| Delete Listing | Protected deletion                           |
| Authentication | JWT-based sessions                           |
| Profile Menu   | Reservations and logout                      |
| Navigation     | Client-side routing                          |
| Styling        | Consistent responsive UI                     |
| Error Handling | Validation and API feedback                  |
| Code Quality   | Modular components and reusable logic        |

---

# Backend Rubric Coverage

The backend is structured to address the complete Node.js assessment.

| Requirement         | Implementation                             |
| ------------------- | ------------------------------------------ |
| Project Structure   | Controllers, models, routes and middleware |
| Accommodation CRUD  | Create, read, update and delete            |
| User Authentication | JWT + bcrypt                               |
| Reservations        | Create, read, update status and delete     |
| Middleware          | Authentication and authorization           |
| Error Handling      | Centralized error handler                  |
| MongoDB             | Mongoose schemas and relationships         |
| API Documentation   | Endpoint reference in README               |
| Security            | Helmet, CORS, rate limiting and validation |
| Performance         | Efficient database queries and modular API |
| Clean Code          | Separation of concerns                     |
| Testing             | Jest + Supertest                           |
| Integration         | Frontend/API/database integration          |
| Deployment          | Environment configuration and Procfile     |
| Presentation        | Organized full-stack architecture          |

---

# API Request Example

A protected request should include the JWT:

```http
GET /api/users/me
Authorization: Bearer <your-jwt-token>
```

Example successful response:

```json
{
  "success": true,
  "data": {
    "username": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

# Example Reservation Flow

```text
User selects accommodation
        ↓
User selects check-in date
        ↓
User selects check-out date
        ↓
Number of nights calculated
        ↓
Fees and discounts calculated
        ↓
User confirms reservation
        ↓
Frontend sends authenticated request
        ↓
Backend validates user
        ↓
Backend validates accommodation
        ↓
Server calculates totalCost
        ↓
Reservation saved to MongoDB
        ↓
Confirmation returned to frontend
```

---

# Project Goals

This project demonstrates practical full-stack development skills including:

* Frontend development.
* Backend development.
* REST API development.
* Database integration.
* Authentication.
* Authorization.
* CRUD operations.
* File handling.
* API security.
* Testing.
* Error handling.
* Responsive UI development.
* Git and GitHub workflow.
* Deployment preparation.

---

# Future Improvements

Potential future improvements include:

* Real-time reservation availability checking.
* Payment gateway integration.
* Email reservation confirmations.
* Advanced accommodation search.
* Sorting by price and rating.
* Map-based property search.
* Host analytics.
* Admin activity logs.
* Image cloud storage.
* Automated deployment through CI/CD.
* More comprehensive automated tests.
* Reservation date conflict prevention.
* Password reset functionality.
* Email verification.
* Two-factor authentication.

---

# Author

**Nonkululeko Mphoentle Maphanga**

Zaio × iHub Africa
Full Stack Web Development Programme
Capstone Project – 2026

---

# Acknowledgements

This project was developed as part of the **Zaio Full Stack Developer Boot Camp Capstone Project**.

The project applies concepts and technologies covered during the Full Stack Web Development programme, including React, JavaScript, Node.js, Express, MongoDB, authentication, APIs, Git, and responsive web development.

---

## License

This project was created for educational and portfolio purposes as part of the Zaio Full Stack Developer Boot Camp Capstone Project.
