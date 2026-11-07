# Backend Specification (V2 Forward-Looking)

> [!WARNING]
> This document is a **forward-looking specification** for the V2 online backend. It is not implemented in V1. It serves as a design reference for when online features are developed in Phase 3.

---

## Table of Contents

- [Overview](#overview)
- [Proposed Data Models](#proposed-data-models)
- [API Endpoints](#api-endpoints)
- [Authentication Approach](#authentication-approach)
- [Realtime Strategy](#realtime-strategy)
- [Anti-Cheat Notes](#anti-cheat-notes)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

---

## Overview

The V2 backend enables online features including user accounts, global leaderboards, head-to-head multiplayer, cloud save, and anti-cheat validation. The backend is designed as a REST API with WebSocket support for real-time features.

**Technology stack (proposed):**

| Component | Technology | Reasoning |
|-----------|-----------|-----------|
| Runtime | Node.js + TypeScript | Share types and validation logic with client |
| Framework | Fastify or Hono | High performance, TypeScript-native |
| Database | PostgreSQL | Relational data (users, scores, matches), robust JSON support |
| ORM | Drizzle ORM | Type-safe, lightweight, excellent DX |
| Cache | Redis | Session store, leaderboard caching, rate limiting |
| Realtime | WebSocket (ws or Socket.io) | Head-to-head matches, live leaderboards |
| Auth | OAuth2 (Google, GitHub, Apple) | No password management, widely adopted |
| Hosting | Railway, Fly.io, or AWS | Auto-scaling, PostgreSQL managed instances |

---

## Proposed Data Models

### User

```typescript
interface User {
  /** Unique user ID (UUID) */
  readonly id: string;
  /** Display name (chosen by user, unique) */
  readonly displayName: string;
  /** Authentication provider */
  readonly authProvider: 'google' | 'github' | 'apple' | 'email';
  /** Provider-specific user ID */
  readonly authProviderId: string;
  /** Email address (from OAuth) */
  readonly email: string;
  /** Avatar URL (from OAuth or custom) */
  readonly avatarUrl: string | null;
  /** Player level (synced from client) */
  readonly playerLevel: number;
  /** Total XP (synced from client) */
  readonly totalXp: number;
  /** Total coins (synced from client) */
  readonly coins: number;
  /** Account creation timestamp */
  readonly createdAt: Date;
  /** Last login timestamp */
  readonly lastLoginAt: Date;
}
```

### Score

```typescript
interface Score {
  /** Unique score ID (UUID) */
  readonly id: string;
  /** User who achieved this score */
  readonly userId: string;
  /** Board size */
  readonly boardSize: number;
  /** Game mode */
  readonly gameMode: GameMode;
  /** Final score value */
  readonly score: number;
  /** Stars earned (1-3) */
  readonly stars: number;
  /** Time taken in seconds */
  readonly timeSeconds: number;
  /** Number of moves made */
  readonly moveCount: number;
  /** Number of hints used */
  readonly hintsUsed: number;
  /** Move replay data (for anti-cheat validation) */
  readonly replay: ReadonlyArray<ReplayMove>;
  /** Daily challenge date (if applicable) */
  readonly dailyDate: string | null;
  /** Server-side validation status */
  readonly validated: boolean;
  /** Submission timestamp */
  readonly submittedAt: Date;
}
```

### Match (Head-to-Head)

```typescript
interface Match {
  /** Unique match ID (UUID) */
  readonly id: string;
  /** Player 1 user ID */
  readonly player1Id: string;
  /** Player 2 user ID */
  readonly player2Id: string;
  /** Board size for this match */
  readonly boardSize: number;
  /** The target solution (same for both players) */
  readonly solutionSeed: number;
  /** Player 1's completion time (null if not finished) */
  readonly player1Time: number | null;
  /** Player 2's completion time (null if not finished) */
  readonly player2Time: number | null;
  /** Winner user ID (null if in progress or draw) */
  readonly winnerId: string | null;
  /** Match status */
  readonly status: 'waiting' | 'active' | 'completed' | 'abandoned';
  /** Match creation timestamp */
  readonly createdAt: Date;
  /** Match completion timestamp */
  readonly completedAt: Date | null;
}
```

### Challenge

```typescript
interface Challenge {
  /** Unique challenge ID (UUID) */
  readonly id: string;
  /** User who created the challenge */
  readonly senderId: string;
  /** User who received the challenge */
  readonly receiverId: string;
  /** Board size */
  readonly boardSize: number;
  /** Pre-placed queens (if any) */
  readonly preplaced: ReadonlyArray<readonly [number, number]>;
  /** Sender's best score (set after sender completes) */
  readonly senderScore: number | null;
  /** Receiver's best score (set after receiver completes) */
  readonly receiverScore: number | null;
  /** Challenge status */
  readonly status: 'pending' | 'accepted' | 'completed' | 'declined' | 'expired';
  /** Expiry timestamp */
  readonly expiresAt: Date;
  /** Creation timestamp */
  readonly createdAt: Date;
}
```

---

## API Endpoints

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/auth/login/:provider` | Initiate OAuth flow (redirect to provider) |
| `GET` | `/api/auth/callback/:provider` | OAuth callback (exchange code for token) |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/me` | Get current user profile |

### Users

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/users/:id` | Get user profile |
| `PATCH` | `/api/users/:id` | Update user profile (display name, avatar) |
| `GET` | `/api/users/:id/stats` | Get user statistics |

### Scores & Leaderboards

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/scores` | Submit a score (with replay data) |
| `GET` | `/api/scores/personal` | Get current user's score history |
| `GET` | `/api/leaderboards/daily` | Daily challenge leaderboard |
| `GET` | `/api/leaderboards/weekly` | Weekly top scores |
| `GET` | `/api/leaderboards/all-time` | All-time top scores |
| `GET` | `/api/leaderboards/:boardSize` | Leaderboard for a specific board size |

### Matches

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/matches` | Create a new match (find opponent) |
| `GET` | `/api/matches/:id` | Get match details |
| `POST` | `/api/matches/:id/complete` | Submit match completion |

### Challenges

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/challenges` | Send a challenge to another user |
| `GET` | `/api/challenges/incoming` | Get pending received challenges |
| `GET` | `/api/challenges/outgoing` | Get sent challenges |
| `POST` | `/api/challenges/:id/accept` | Accept a challenge |
| `POST` | `/api/challenges/:id/decline` | Decline a challenge |
| `POST` | `/api/challenges/:id/complete` | Submit challenge completion |

### Cloud Save

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/sync/progress` | Download cloud-saved progress |
| `PUT` | `/api/sync/progress` | Upload local progress to cloud |
| `GET` | `/api/sync/settings` | Download cloud-saved settings |
| `PUT` | `/api/sync/settings` | Upload local settings to cloud |

---

## Authentication Approach

Authentication uses **OAuth2** with multiple providers. No password-based auth is implemented to reduce security surface area.

### Flow

```
Client                    Server                   OAuth Provider
  │                         │                           │
  │  GET /auth/login/google │                           │
  │ ──────────────────────► │                           │
  │                         │  Redirect to Google OAuth │
  │  ◄─────────────────────────────────────────────────►│
  │                         │                           │
  │  GET /auth/callback     │                           │
  │  ?code=xxx              │  Exchange code for token  │
  │ ──────────────────────► │ ─────────────────────────►│
  │                         │  ◄────────────────────────│
  │                         │  User info                │
  │                         │                           │
  │  Set-Cookie: session    │  Create/update user       │
  │  ◄───────────────────── │  Issue JWT access token   │
  │                         │                           │
```

### Token Strategy

- **Access token:** Short-lived JWT (15 minutes), sent in `Authorization: Bearer` header.
- **Refresh token:** Long-lived (30 days), stored in HTTP-only secure cookie.
- **Session store:** Redis, for token revocation and refresh token rotation.

---

## Realtime Strategy

Real-time features use **WebSocket** connections for:

1. **Head-to-head matches:** Both players receive real-time updates on opponent's progress.
2. **Live leaderboards:** Daily leaderboard updates push to connected clients.
3. **Match-making:** Queue status and opponent found notifications.

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `match:found` | Server → Client | Opponent found, match starting |
| `match:opponent_progress` | Server → Client | Opponent placed a queen / made progress |
| `match:opponent_complete` | Server → Client | Opponent has completed the puzzle |
| `match:complete` | Server → Client | Match result (win/lose/draw) |
| `leaderboard:update` | Server → Client | Leaderboard position changed |
| `challenge:received` | Server → Client | New challenge from another player |

### Connection Management

- WebSocket connects after authentication.
- Heartbeat ping every 30 seconds to detect stale connections.
- Automatic reconnection with exponential backoff on the client.
- Room-based routing for matches (each match is a room with 2 participants).

---

## Anti-Cheat Notes

Since the game runs client-side, anti-cheat measures are critical for competitive features:

### Server-Side Validation

1. **Replay validation:** Every score submission includes a `replay` array of all moves with timestamps. The server replays the moves using the same `core/` logic to verify:
   - The final board state is a valid N-Queens solution.
   - The score calculation matches the submitted score.
   - The move count matches.
   - The solution matches the daily puzzle seed (for daily challenges).

2. **Time sanity checks:**
   - The total elapsed time (sum of move timestamp deltas) must approximately match the claimed time.
   - Minimum time thresholds: a 4×4 puzzle cannot be solved in under 2 seconds by a human.
   - Maximum time between moves: if any gap exceeds 30 minutes, the session is flagged.

3. **Rate limiting:**
   - Maximum score submissions per hour per user.
   - Cooldown between match completions.

### What We Cannot Prevent (V2)

- **Automated solvers:** A determined attacker can run the solver and submit moves. Mitigation: minimum time thresholds and CAPTCHA for suspicious patterns.
- **Modified client:** The JavaScript can be modified to submit fake replays. Mitigation: replay validation catches incorrect solutions, but timing can be spoofed.

> [!CAUTION]
> Anti-cheat in a client-side game is inherently limited. The replay validation and time sanity checks are **deterrents**, not guarantees. For high-stakes features (tournaments with prizes), additional measures like proctoring or server-side puzzle reveal timing would be needed.

---

## Database Schema

### PostgreSQL Tables

```sql
-- Users table
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name  VARCHAR(50) UNIQUE NOT NULL,
  auth_provider VARCHAR(20) NOT NULL,
  auth_provider_id VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  player_level  INTEGER DEFAULT 1,
  total_xp      INTEGER DEFAULT 0,
  coins         INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(auth_provider, auth_provider_id)
);

-- Scores table
CREATE TABLE scores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  board_size  INTEGER NOT NULL,
  game_mode   VARCHAR(20) NOT NULL,
  score       INTEGER NOT NULL,
  stars       INTEGER NOT NULL CHECK (stars BETWEEN 0 AND 3),
  time_seconds INTEGER NOT NULL,
  move_count  INTEGER NOT NULL,
  hints_used  INTEGER NOT NULL DEFAULT 0,
  replay      JSONB NOT NULL,
  daily_date  DATE,
  validated   BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scores_user_id ON scores(user_id);
CREATE INDEX idx_scores_daily ON scores(daily_date, score DESC);
CREATE INDEX idx_scores_leaderboard ON scores(board_size, game_mode, score DESC);

-- Matches table
CREATE TABLE matches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id    UUID REFERENCES users(id),
  player2_id    UUID REFERENCES users(id),
  board_size    INTEGER NOT NULL,
  solution_seed INTEGER NOT NULL,
  player1_time  INTEGER,
  player2_time  INTEGER,
  winner_id     UUID REFERENCES users(id),
  status        VARCHAR(20) DEFAULT 'waiting',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at  TIMESTAMPTZ
);

-- Challenges table
CREATE TABLE challenges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id     UUID REFERENCES users(id),
  receiver_id   UUID REFERENCES users(id),
  board_size    INTEGER NOT NULL,
  preplaced     JSONB DEFAULT '[]',
  sender_score  INTEGER,
  receiver_score INTEGER,
  status        VARCHAR(20) DEFAULT 'pending',
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenges_receiver ON challenges(receiver_id, status);

-- Cloud save table
CREATE TABLE user_progress (
  user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  progress_data JSONB NOT NULL,
  settings_data JSONB NOT NULL,
  schema_version INTEGER NOT NULL DEFAULT 1,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Deployment

### Proposed Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│   Client    │────►│   CDN/Edge   │────►│  Static Assets │
│ (Web/Mobile)│     │ (Cloudflare) │     │  (Next.js out) │
└──────┬──────┘     └──────────────┘     └────────────────┘
       │
       │ HTTPS / WSS
       ▼
┌──────────────┐     ┌──────────────┐     ┌────────────────┐
│  API Server  │────►│    Redis     │     │  PostgreSQL    │
│  (Fastify)   │     │  (Sessions,  │     │  (Data store)  │
│  + WebSocket │     │   Cache)     │     │                │
└──────────────┘     └──────────────┘     └────────────────┘
```

### Environment Requirements

| Environment | Purpose | Infrastructure |
|------------|---------|---------------|
| Development | Local development | Docker Compose (Postgres + Redis) |
| Staging | Pre-production testing | Railway or Fly.io (single instance) |
| Production | Live service | Railway or AWS (auto-scaling, managed DB) |

### Key Decisions (TBD)

- Exact hosting provider (Railway vs Fly.io vs AWS)
- CDN strategy (Cloudflare vs Vercel Edge)
- Database backup and disaster recovery plan
- Monitoring and alerting (Sentry, Datadog, or self-hosted)
- CI/CD pipeline (GitHub Actions)

> [!NOTE]
> All backend deployment decisions will be finalized when Phase 3 development begins. This spec provides the architectural blueprint to guide implementation.
