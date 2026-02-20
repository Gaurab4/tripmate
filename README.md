# TripMate — AI Travel Companion MVP

A semi-AI travel companion web app that generates day-wise itineraries using OpenAI and Google Places.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Django, Django REST Framework, PostgreSQL
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Places**: OpenStreetMap (Nominatim)

## Quick Start

### 1. Backend

```bash
cd tripmate-backend
python -m venv venv
source venv/bin/activate   # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env      # edit with your keys
python manage.py migrate
python manage.py runserver
```

Create a PostgreSQL database and set `DB_*` in `.env`. Without `GEMINI_API_KEY`, itinerary generation returns empty. Places use OpenStreetMap (no key needed).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### 3. API Keys (optional)

- **Gemini**: Get key at https://aistudio.google.com/apikey — used for itinerary generation and customization. Model: gemini-2.0-flash.
- **Places**: Uses OpenStreetMap Nominatim — no API key required.

## Features

- Enter destination, dates, and interests
- AI-generated day-wise itinerary (3–5 activities per day)
- Add / Replace / Remove activities (each triggers AI update)
- Save trip to PostgreSQL (requires account)
- Export JSON, copy itinerary to clipboard

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trips/create/` | Create itinerary (destination, dates, interests) |
| POST | `/api/trips/customize/` | Add/replace/remove activity (plan in body) |
| PATCH | `/api/trips/<id>/edit/` | Update saved trip (auth) |
| POST | `/api/trips/<id>/customize/` | Customize saved trip (auth) |
| GET | `/api/places/search/?q=...` | Search attractions |
| POST | `/api/itineraries/` | Save trip (auth) |
