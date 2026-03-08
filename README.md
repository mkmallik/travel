# Travel Expense Tracker

A full-stack mobile app for tracking travel expenses, itineraries, and important links across trips.

## Tech Stack

### Frontend
- **React Native** with Expo SDK 55 (managed workflow)
- **Expo Router** for file-based navigation
- **React Native Paper** for Material Design UI
- **TypeScript** throughout

### Backend
- **Python FastAPI** REST API
- **SQLite** database (via stdlib sqlite3)
- **JWT authentication** (PyJWT)

## Project Structure

```
travel/
├── src/                          # React Native frontend
│   ├── api/client.ts             # HTTP client with JWT token management
│   ├── app/                      # Expo Router screens
│   │   ├── (auth)/               # Login & signup screens
│   │   ├── (tabs)/               # Main tab navigation
│   │   │   ├── itineraries.tsx   # Daily itinerary planning
│   │   │   ├── spends.tsx        # Expense tracker by date
│   │   │   ├── daily-totals.tsx  # Aggregated daily spending
│   │   │   ├── category-totals.tsx # Spending by category
│   │   │   └── data-links.tsx    # Saved booking/travel links
│   │   ├── expense/              # Add/edit expense screens
│   │   ├── itinerary/            # Itinerary detail & photo
│   │   ├── travel/               # Create/select trips
│   │   └── link/                 # Add links
│   ├── components/               # Reusable UI components
│   ├── db/queries/               # API-backed data access layer
│   ├── hooks/                    # Auth & travel context providers
│   ├── types/                    # TypeScript interfaces
│   └── utils/                    # Constants, currency, date helpers
├── server/                       # FastAPI backend
│   ├── app/
│   │   ├── main.py               # App entry, CORS, router setup
│   │   ├── auth.py               # JWT token create/verify
│   │   ├── models.py             # Pydantic request/response models
│   │   ├── db/database.py        # SQLite init, schema, seed data
│   │   └── routes/
│   │       ├── auth.py           # POST /auth/login, /auth/signup
│   │       ├── travel.py         # CRUD /travels
│   │       ├── itinerary.py      # CRUD /travels/{id}/itineraries
│   │       ├── expense.py        # CRUD + totals for expenses
│   │       └── links.py          # CRUD /links
│   └── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Expo Go app on your phone

### Backend Setup

```bash
cd server
pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

The database is automatically created and seeded with demo data on first run.

### Frontend Setup

```bash
npm install
npx expo start
```

Update the `API_HOST` in `src/api/client.ts` to point to your backend server IP.

### Demo Accounts

| Email | Password |
|-------|----------|
| demo@travel.app | demo1234 |
| mkmallik@gmail.com | manas123 |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/signup` | Register new user |
| GET/POST | `/travels` | List/create trips |
| GET/PUT/DELETE | `/travels/{id}` | Trip CRUD |
| GET/POST | `/travels/{id}/itineraries` | Itineraries (supports `?date=` filter) |
| GET/PUT/DELETE | `/travels/{id}/itineraries/{id}` | Itinerary CRUD |
| GET/POST | `/travels/{id}/expenses` | Expenses (supports `?date=` filter) |
| GET | `/travels/{id}/expenses/daily-totals` | Daily expense aggregation |
| GET | `/travels/{id}/expenses/category-totals` | Category breakdown |
| GET | `/travels/{id}/expenses/total` | Trip total in EUR |
| GET/PUT/DELETE | `/travels/{id}/expenses/{id}` | Expense CRUD |
| GET/POST | `/links` | All links / create |
| GET/PUT/DELETE | `/links/{id}` | Link CRUD |
| GET | `/travels/{id}/links` | Links for a trip |
| GET | `/health` | Health check |

API docs available at `http://localhost:8001/docs` (Swagger UI).

## Features

- Multi-trip management with trip selector
- Daily itinerary planning with city photos, accommodation, and transport details
- Expense tracking with dual currency support (EUR + local currency)
- Receipt photo capture (camera or gallery)
- Voice input for expense descriptions
- Daily and category-wise expense breakdowns with running totals
- Important links organizer (bookings, transport, restaurants, activities)
- JWT-based authentication with signup/login
