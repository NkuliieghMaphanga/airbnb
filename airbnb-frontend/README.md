# Airbnb Clone – Frontend

React (Vite) frontend for the Zaio Full Stack Developer Boot Camp Capstone project.
Implements the Home Page, Location Page, and Location Details Page against the
[`airbnb-backend`](../airbnb-backend) API.

## Tech Stack

- **React 18** + **React Router 6**
- **Vite** – dev server and bundler
- **Axios** – API client with a JWT-attaching interceptor
- Plain CSS with a small design-token system (`src/styles/global.css`)

## Project Structure

```
src/
├── api/                # axios wrapper + endpoint modules
├── components/         # Header, Footer, HeroBanner, cards, calculator, gallery...
├── context/AuthContext.jsx   # shared login state (token in localStorage)
├── data/staticContent.js     # static copy for Home page sections
├── pages/
│   ├── HomePage.jsx
│   ├── LocationPage.jsx
│   ├── LocationDetailsPage.jsx
│   ├── LoginPage.jsx
│   └── ReservationsPage.jsx
└── styles/              # one stylesheet per component/page area
```

## Pages

- **Home** (`/`) – hero banner, inspiration location cards, experiences, ShopAirbnb
  section, tabbed future-getaways section, footer.
- **Location** (`/locations/:location`) – filter bar, listing cards (image left,
  details right), heading with count + location name. Pulls from
  `GET /api/accommodations?location=`.
- **Location Details** (`/locations/:location/:id`) – heading/subheading, image
  gallery, two-column layout (details + sticky cost calculator), static info
  sections, and a reservation form that calls `POST /api/reservations`.
- **Login/Sign up** (`/login`) – validated form, toggles between login and register.
- **Reservations** (`/reservations`) – table of the logged-in user's bookings with
  cancel support.

## Getting Started

1. Make sure the backend (`airbnb-backend`) is running on `http://localhost:5000`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` if you need to point at a different API URL.
4. Run the dev server:
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:3000` and proxies `/api` to the backend.
5. Build for production:
   ```bash
   npm run build
   ```

## Deployment (Heroku)

This is a static build. The simplest Heroku setup is to serve `dist/` with a small
static server buildpack, or deploy the frontend to a static host (Netlify/Vercel)
and point `VITE_API_URL` at your deployed backend's URL. If deploying to Heroku
directly, add a `serve` script and a `Procfile`:

```
web: npx serve -s dist -l $PORT
```
