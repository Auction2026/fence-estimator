# Authentication Flow

## Overview

This diagram shows how login, JWT token generation, and access control work.

```
USER VISITS APP
       │
       ▼
┌─────────────────────────────────────────┐
│  Login Page                             │
│  • Enter username / email               │
│  • Enter password                       │
└──────────────────┬──────────────────────┘
                   │  POST /api/auth/login
                   │  { email, password }
                   ▼
┌─────────────────────────────────────────┐
│  BACKEND — Auth Controller              │
│  1. Look up user by email               │
│  2. Compare password hash (bcrypt)      │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
    INVALID                 VALID
    credentials             credentials
         │                    │
         ▼                    ▼
  Return HTTP 401      Generate JWT Token
  "Invalid login"      │
                       │  Token payload:
                       │  { userId, role, exp }
                       │  Signed with SECRET_KEY
                       │
                       ▼
               Return HTTP 200
               { token, user }
                       │
                       ▼
┌─────────────────────────────────────────┐
│  FRONTEND                               │
│  • Store token in localStorage          │
│  • Redirect to Dashboard                │
└─────────────────────────────────────────┘

────────────────────────────────────────────
SUBSEQUENT API CALLS
────────────────────────────────────────────

USER ACTION (e.g. load projects)
       │
       ▼
Frontend reads token from localStorage
       │
       ▼
Attaches to request header:
  Authorization: ******
       │
       ▼
┌─────────────────────────────────────────┐
│  BACKEND — Auth Middleware              │
│  1. Read Authorization header           │
│  2. Verify JWT signature                │
│  3. Check token not expired             │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
    INVALID /              VALID
    expired token          token
         │                    │
         ▼                    ▼
  Return HTTP 401      Attach user to request
  "Unauthorized"       Continue to controller
  Frontend clears      Return data (HTTP 200)
  token, redirects
  to login

────────────────────────────────────────────
LOGOUT
────────────────────────────────────────────

User clicks Logout
       │
       ▼
Frontend deletes token from localStorage
       │
       ▼
Redirect to Login page
(No server call needed — JWT is stateless)
```

---

## Role-Based Access

| Role | Can Do |
|---|---|
| Admin | All tabs, all projects, user management |
| Estimator | Create and edit estimates and contracts |
| Viewer | Read-only — view projects and estimates |

---

## Token Settings

| Setting | Value |
|---|---|
| Algorithm | HS256 |
| Expiry | 8 hours |
| Storage | `localStorage` |
| Header name | `Authorization: Bearer` |
