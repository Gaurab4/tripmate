# TripMate Frontend

React (Vite) app: register, login, search and save itineraries.

## Setup

1. **Install Node.js** (if needed): https://nodejs.org/

2. **Install dependencies**
   ```bash
   cd tripmate/frontend
   npm install
   ```

3. **Run the backend** (in another terminal)
   ```bash
   cd tripmate/tripmate-backend
   source venv/bin/activate
   python manage.py runserver
   ```
   Backend should be at http://127.0.0.1:8000

4. **Run the frontend**
   ```bash
   npm run dev
   ```
   App runs at http://localhost:5173. API requests to `/api/*` are proxied to the backend.

## Features

- **Register** — Create account (username, password, email optional)
- **Login** — Get token; stored in localStorage
- **Home** — Search box for itinerary (destination/trip name), “Save this itinerary” to add to your list
- **My itineraries** — List of saved itineraries (from backend)

## Build

```bash
npm run build
```

Output is in `dist/`. For production, serve that folder and point API to your backend (e.g. env `VITE_API_URL` and use it in `src/api.js` instead of relative `/api`).
