# TripNova — Database Schema (MongoDB / Mongoose)

Four collections. Relationships are referenced (not embedded) except where data
is always read together with its parent (e.g. itinerary activities).

## `users`
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, indexed |
| password | String | bcrypt hash, `select: false` |
| avatarUrl | String | |
| preferences.budgetTier | enum: budget / mid-range / luxury | |
| preferences.travelStyle | [String] | adventure, culture, food, ... |
| preferences.dietary | [String] | vegetarian, halal, vegan, ... |
| preferences.homeCurrency | String | default `USD` |
| preferences.preferredTransport | [String] | flight, train, car |
| savedTrips | [ObjectId → trips] | |
| role | enum: user / admin | |
| isVerified | Boolean | |
| lastLoginAt | Date | |
| timestamps | createdAt, updatedAt | |

## `trips`
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → users | required, indexed |
| title | String | required |
| destination.city / country / lat / lng / placeId | | Google Places-resolved |
| startDate / endDate | Date | required |
| travelers | Number | default 1 |
| budgetTier | enum | |
| interests | [String] | |
| estimatedCost | embedded budgetBreakdown | accommodation/food/transport/activities/misc/total/currency |
| itinerary | ObjectId → itineraries | |
| status | enum: draft / planned / confirmed / completed / archived | |
| timestamps | | |

Compound index: `{ user: 1, createdAt: -1 }` for fast "my trips" listing.

## `itineraries`
| Field | Type | Notes |
|---|---|---|
| trip | ObjectId → trips | required, indexed |
| generatedBy | enum: ai / user / hybrid | |
| days[] | embedded | dayNumber, date, theme, activities[] |
| days[].activities[] | embedded | time, title, category, location {name, lat, lng, placeId}, estimatedCost, durationMinutes, notes |
| weatherSnapshot[] | embedded | date, summary, tempHighC, tempLowC, icon |
| safetyNotes | [String] | derived heuristics / advisory feed |
| rawModelResponse | String | full Claude reply, kept for auditability |
| timestamps | | |

Days/activities are embedded (not their own collection) because they are
always fetched and rendered together with the itinerary as a whole, and are
bounded in size (a two-week trip is at most ~14 day-documents).

## `chatsessions`
| Field | Type | Notes |
|---|---|---|
| user | ObjectId → users | required, indexed |
| trip | ObjectId → trips | optional link to the trip being discussed |
| title | String | derived from first message |
| messages[] | embedded | role (user/assistant/system), content, createdAt |
| timestamps | | |

Compound index: `{ user: 1, updatedAt: -1 }` for the conversation list sidebar.

## Entity relationship summary

```
User ──1:N── Trip ──1:1── Itinerary
  │
  └──1:N── ChatSession ──(optional)──> Trip
```
