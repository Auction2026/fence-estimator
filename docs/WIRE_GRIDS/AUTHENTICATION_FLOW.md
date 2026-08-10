# WIRE GRID 7: AUTHENTICATION FLOW

```
╔══════════════════════════════════════════════════╗
║           LOGIN & AUTHENTICATION FLOW            ║
╚══════════════════════════════════════════════════╝

BROWSER (Frontend)
  │
  │  User enters: username + password
  │
  ▼
┌──────────────────────────────┐
│       app.login(event)       │
│                              │
│  1. Validate inputs          │
│  2. Check DEMO_USERS (offline)│
│     OR POST /api/auth/login  │
└──────────────────────────────┘
  │
  ├──── DEMO MODE (no backend) ──────────────────────────────────┐
  │     Match against hardcoded users:                           │
  │     admin/admin123, estimator/estimate123                    │
  │     Store user in localStorage[LS_USER]                      │
  │     Show app shell                                           │
  │                                                              │
  └──── BACKEND MODE ────────────────────────────────────────────┤
        │                                                        │
        ▼                                                        │
  POST /api/auth/login                                           │
  { username, password }                                         │
        │                                                        │
        ▼                                                        │
  ┌─────────────────────────┐                                    │
  │ backend/server.js       │                                    │
  │                         │                                    │
  │ 1. Find user by username│                                    │
  │ 2. bcrypt.compare()     │──── FAIL ──► 401 "Invalid creds"  │
  │ 3. jwt.sign() token     │                                    │
  │    { id, role, username }│                                   │
  │    expires: 7 days      │                                    │
  └─────────────────────────┘                                    │
        │                                                        │
        ▼                                                        │
  200 { token, user }                                            │
        │                                                        │
        ▼                                                        │
  Store token in localStorage['jwtToken']                        │
  Include in headers: Authorization: ******             │
        │                                                        │
        └────────────────────────────────────────────────────────┘
                              │
                              ▼
                      App Shell Visible
                      All 17 Tabs Accessible

LOGOUT FLOW:
  app.logout()
    → Remove LS_USER from localStorage
    → Hide app shell
    → Show login screen
    → JWT token discarded

PROTECTED ROUTE FLOW:
  Frontend request with JWT
    → server.js authMiddleware
    → jwt.verify(token, JWT_SECRET)
    → FAIL: 401 Unauthorized
    → PASS: req.user = { id, role, username }
    → Continue to route handler
```
