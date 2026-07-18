# TripNova — API Reference

Base URL: `/api`. All endpoints (except `/auth/signup`, `/auth/login`, `/health`)
require authentication via an httpOnly `token` cookie or `Authorization: Bearer <token>` header.

Response envelope: `{ success: boolean, ...data }` on success, `{ success: false, message }` on error.

## Auth

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/auth/signup` | `{ name, email, password }` | Create account, returns user + JWT |
| POST | `/auth/login` | `{ email, password }` | Returns user + JWT |
| POST | `/auth/logout` | — | Clears auth cookie |
| GET | `/auth/me` | — | Current user profile |
| PATCH | `/auth/preferences` | `{ budgetTier?, travelStyle?, dietary?, homeCurrency?, preferredTransport? }` | Update travel preferences |

## Chat (Claude-powered conversational planning)

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/chat/guest` | `{ message, history? }` | **Public**, no auth. Stateless — the client resends its own short history each turn. Powers the floating assistant bubble for visitors who haven't signed in yet. Rate-limited to 20 messages / 15 min per IP. |
| GET | `/chat` | — | List the user's chat sessions |
| POST | `/chat` | `{ message, tripContext? }` | Start a new session, get AI reply (+ structured itinerary/cost JSON if present) |
| POST | `/chat/:sessionId` | `{ message, tripContext? }` | Continue an existing session |
| GET | `/chat/:sessionId` | — | Full message history for a session |
| DELETE | `/chat/:sessionId` | — | Delete a session |

`tripContext` (optional) lets the frontend pass the active trip's destination/budget/travelers
so Claude's replies stay grounded to that trip.

## Trips

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/trips` | `{ title?, destinationName, startDate, endDate, travelers, budgetTier, interests[] }` | Create trip (geocodes destination, seeds a baseline cost estimate) |
| GET | `/trips` | — | List the user's trips |
| GET | `/trips/:id` | — | Trip detail, with populated itinerary |
| POST | `/trips/:id/generate-itinerary` | — | Ask Claude to draft a full day-wise itinerary + cost estimate for the trip, enriched with live weather & derived safety notes |
| DELETE | `/trips/:id` | — | Delete a trip |

## Places (Google Maps Platform)

| Method | Path | Query | Description |
|---|---|---|---|
| GET | `/places/search` | `query, lat?, lng?, radius?, type?` | Text search for hotels/restaurants/attractions |
| GET | `/places/:placeId` | — | Full place details (hours, phone, website) |
| GET | `/places/distance` | `origin, destination, mode?` | Distance/duration between two points |

## Weather & Safety

| Method | Path | Query | Description |
|---|---|---|---|
| GET | `/weather` | `lat, lng` | Current conditions |
| GET | `/weather/forecast` | `lat, lng` | 5-day condensed forecast + derived safety notes |

## Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check, no auth required |

## Example: full planning flow

```bash
# 1. Sign up
curl -X POST /api/auth/signup -H 'Content-Type: application/json' \
  -d '{"name":"Asha","email":"asha@example.com","password":"correcthorsebattery"}'

# 2. Create a trip
curl -X POST /api/trips -H 'Content-Type: application/json' -b cookies.txt \
  -d '{"destinationName":"Lisbon, Portugal","startDate":"2026-09-10","endDate":"2026-09-14","travelers":2,"budgetTier":"mid-range","interests":["food","culture"]}'

# 3. Generate the itinerary (Claude + live weather)
curl -X POST /api/trips/<tripId>/generate-itinerary -b cookies.txt

# 4. Keep chatting about it
curl -X POST /api/chat -H 'Content-Type: application/json' -b cookies.txt \
  -d '{"message":"Swap day 2 dinner for something vegetarian","tripContext":{"destination":{"city":"Lisbon"}}}'
```
