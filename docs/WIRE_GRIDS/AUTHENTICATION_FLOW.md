# WIRE GRID 7 – AUTHENTICATION FLOW
## User Login, Token Management, Role-Based Access

```
╔══════════════════════════════════════════════════════════════════════╗
║                   AUTHENTICATION FLOW                               ║
╚══════════════════════════════════════════════════════════════════════╝

─────────────────────────────────────────────────────────────
LOGIN PROCESS
─────────────────────────────────────────────────────────────

  USER: enters email + password
          │
          ▼ POST /api/auth/login
  ┌─────────────────────────┐
  │  Backend receives       │
  │  { email, password }    │
  └───────────┬─────────────┘
              │
              ▼
  ┌─────────────────────────┐
  │  Look up user by email  │ ← SELECT FROM users WHERE email = $1
  └───────────┬─────────────┘
              │
         ┌────┴────┐
         │         │
         ▼         ▼
      FOUND      NOT FOUND
         │         │
         │         └──→ Return 401 "Invalid credentials"
         │
         ▼
  ┌─────────────────────────┐
  │  bcrypt.compare()       │ ← Compare input with stored hash
  │  (password check)       │
  └───────────┬─────────────┘
              │
         ┌────┴────┐
         │         │
         ▼         ▼
      MATCH     NO MATCH
         │         │
         │         └──→ Return 401 "Invalid credentials"
         │
         ▼
  ┌─────────────────────────┐
  │  jwt.sign()             │ ← Create token with user ID + role
  │  JWT_SECRET from .env   │   Expires in 24 hours
  └───────────┬─────────────┘
              │
              ▼ Return 200
  { token: "eyJ...", user: { id, name, email, role } }
              │
              ▼ Frontend stores:
  localStorage.setItem('fd_token', token)
  localStorage.setItem('fd_user', JSON.stringify(user))

─────────────────────────────────────────────────────────────
PER-REQUEST AUTH CHECK
─────────────────────────────────────────────────────────────

  BROWSER makes any API request
          │
          │ Header: "Authorization: ******"
          ▼
  ┌─────────────────────────┐
  │  authMiddleware()       │
  │  (runs before every     │
  │  protected route)       │
  └───────────┬─────────────┘
              │
              ▼ jwt.verify(token, JWT_SECRET)
         ┌────┴────┐
         │         │
         ▼         ▼
      VALID     INVALID/EXPIRED
         │         │
         │         └──→ Return 401
         │
         ▼ req.user = { id, role, ... }
  ┌─────────────────────────┐
  │  Route Handler runs     │
  └─────────────────────────┘

─────────────────────────────────────────────────────────────
ROLE-BASED ACCESS CONTROL
─────────────────────────────────────────────────────────────

  Role          │ Estimates │ Contracts │ Admin  │ Users
  ──────────────┼───────────┼───────────┼────────┼───────
  admin         │ Full      │ Full      │ Full   │ Full
  manager       │ Full      │ Full      │ Read   │ None
  estimator     │ Full      │ Read      │ None   │ None
  viewer        │ Read      │ Read      │ None   │ None

─────────────────────────────────────────────────────────────
LOGOUT
─────────────────────────────────────────────────────────────

  User clicks Logout
          │
          ▼
  localStorage.removeItem('fd_token')
  localStorage.removeItem('fd_user')
          │
          ▼
  Display "Guest" in navbar
  All subsequent API calls return 401 (unauthenticated)
```
