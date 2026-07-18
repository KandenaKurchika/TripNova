# TripNova — AI-Powered Travel & Tourism Assistant

TripNova is a full-stack chatbot application that helps users plan personalized
trips: destination, hotel, restaurant, transport and attraction recommendations
matched to budget and preferences, day-wise itineraries, cost estimates, live
weather and safety context, Google Maps integration, and authenticated saved
trips — all backed by MongoDB and the Claude API for conversational AI.

## Tech stack

- **Frontend**: React 18 + Vite, React Router, Tailwind CSS, `@react-google-maps/api`, Axios
- **Backend**: Node.js + Express, Mongoose (MongoDB), JWT auth (httpOnly cookies), Helmet, rate limiting
- **AI**: Anthropic Claude API (`@anthropic-ai/sdk`), model `claude-sonnet-4-6`
- **External APIs**: Google Maps Platform (Places, Geocoding, Distance Matrix), OpenWeatherMap
- **Database**: MongoDB Atlas (or self-hosted)

## Folder structure

```
tripnova/
├── backend/
│   ├── config/db.js                 # Mongoose connection
│   ├── models/                      # User, Trip, Itinerary, ChatSession
│   ├── middleware/                  # auth (JWT), errorHandler, validate
│   ├── routes/                      # authRoutes, chatRoutes, tripRoutes, placesRoutes, weatherRoutes
│   ├── controllers/                 # request handlers per resource
│   ├── services/                    # claudeService, googleMapsService, weatherService, costEstimatorService
│   ├── utils/generateToken.js
│   ├── server.js                    # app entrypoint
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axiosClient.js
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/                   # Login, Signup, Dashboard, ChatPlanner
│   │   ├── components/              # Navbar, Sidebar, ChatWindow, MessageBubble,
│   │   │                            # TripPreferencesForm, ItineraryTimeline, WeatherSafetyCard, MapView
│   │   ├── styles/index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── docs/
    ├── API_REFERENCE.md
    └── DATABASE_SCHEMA.md
```

## How the pieces connect

1. **Auth**: Signup/login issue a JWT stored in an httpOnly cookie (and mirrored
   to `localStorage` for non-cookie clients). `protect` middleware verifies it
   on every private route.
2. **Chat**: Each message hits `POST /api/chat[/:sessionId]`, which loads/creates
   a `ChatSession`, forwards the full turn history to Claude via
   `services/claudeService.js`, and stores the reply. Claude is instructed to
   append a fenced ` ```json ` block with structured itinerary/cost data when
   relevant; the backend parses it out via `extractStructuredPayload`.
3. **Trips → Itinerary generation**: `POST /api/trips/:id/generate-itinerary`
   geocodes the destination (Google Maps), pulls a 5-day forecast
   (OpenWeatherMap), derives simple safety notes, and asks Claude for a full
   day-wise plan grounded in that weather context. The result is saved as an
   `Itinerary` document linked back to the `Trip`.
4. **Frontend**: `ChatPlanner` page renders the conversational UI
   (`ChatWindow`) alongside a live-updating side panel: map, itinerary
   timeline, weather/safety card and running cost estimate — all driven by the
   same `structured` payload returned from chat or itinerary generation.

## Local development

### Prerequisites
- Node.js 18+
- A MongoDB connection string (Atlas free tier works)
- API keys: Anthropic, Google Maps Platform (Places API, Geocoding API, Distance Matrix API, Maps JavaScript API), OpenWeatherMap

### Backend
```bash
cd backend
cp .env.example .env      # fill in MONGODB_URI, JWT_SECRET, ANTHROPIC_API_KEY, GOOGLE_MAPS_API_KEY, OPENWEATHER_API_KEY
npm install
npm run dev                # nodemon, http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env       # fill in VITE_GOOGLE_MAPS_BROWSER_KEY (a separate, domain-restricted browser key)
npm install
npm run dev                # http://localhost:5173, proxies /api to :5000
```

## Deployment guide

A simple, low-ops production layout: **MongoDB Atlas** (database) +
**Render or Railway** (backend) + **Vercel or Netlify** (frontend). Any Node
host works the same way; swap commands accordingly.

### 1. Database — MongoDB Atlas
1. Create a free/shared cluster at https://cloud.mongodb.com.
2. Create a database user with a strong password.
3. Network access → allow your backend host's IP, or `0.0.0.0/0` if your host uses dynamic egress IPs (tighten later with a VPC peering or IP allowlist for production).
4. Copy the SRV connection string into `MONGODB_URI`.

### 2. Backend — Render (or Railway/Fly.io/EC2)
1. Push the `backend/` folder to a Git repo (or the whole monorepo with a root directory setting).
2. New Web Service → connect the repo → root directory `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables from `.env.example` (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `COOKIE_SECRET`, `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `GOOGLE_MAPS_API_KEY`, `OPENWEATHER_API_KEY`, `CLIENT_URL` = your deployed frontend URL, `NODE_ENV=production`).
5. Deploy. Confirm `GET https://<backend-host>/api/health` returns `{ success: true }`.

### 3. Frontend — Vercel (or Netlify)
1. Import the repo, root directory `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Environment variable: `VITE_GOOGLE_MAPS_BROWSER_KEY` (a **browser-restricted** key, referrer-locked to your production domain).
4. In `vite.config.js`'s dev proxy is only for local dev — in production, either:
   - Set the frontend to call the backend's absolute URL (add a small `VITE_API_BASE_URL` env var and use it in `axiosClient.js`), **or**
   - Put both behind the same domain via a reverse proxy / rewrites (e.g. Vercel rewrites `/api/*` → backend URL).
5. Deploy, then update the backend's `CLIENT_URL` to match the final frontend domain (for CORS).

### 4. Google Cloud Console setup
1. Enable: Places API, Geocoding API, Distance Matrix API, Maps JavaScript API.
2. Create **two** API keys:
   - Server key (used in `GOOGLE_MAPS_API_KEY` on the backend) — restrict by IP to your backend host.
   - Browser key (used in `VITE_GOOGLE_MAPS_BROWSER_KEY`) — restrict by HTTP referrer to your frontend domain.
3. Set a billing account and a budget alert; Places/Distance Matrix are metered.

### 5. Anthropic (Claude API)
1. Get an API key from the Anthropic Console.
2. Set `ANTHROPIC_API_KEY` on the backend only — never ship it to the frontend.
3. Set `CLAUDE_MODEL=claude-sonnet-4-6` (or the latest model string per Anthropic's docs).

### 6. Production hardening checklist
- [ ] Rotate `JWT_SECRET` / `COOKIE_SECRET` to long random values, never commit `.env`.
- [ ] Set cookies `secure: true` (already conditional on `NODE_ENV=production` in `generateToken.js`).
- [ ] Tighten MongoDB Atlas network access from `0.0.0.0/0` to specific egress IPs where possible.
- [ ] Add request logging/monitoring (e.g. Logtail, Datadog) on top of `morgan`.
- [ ] Add a CDN/cache in front of static place/weather lookups if traffic grows, to reduce third-party API costs.
- [ ] Add automated backups on the Atlas cluster.
- [ ] Add a CI pipeline (lint + basic route tests) before deploy.

## License
Provided as a reference implementation/scaffold for your own project — adapt freely.
