# WIRE GRID 07 — AUTHENTICATION FLOW
## Login, JWT Token, and Authorization

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    AUTHENTICATION & AUTHORIZATION FLOW                   ║
╚══════════════════════════════════════════════════════════════════════════╝

USER ENTERS CREDENTIALS
 username: "john"
 password: "MyPassword123"
          │
          ▼
   POST /api/auth/login
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                 server.js — Auth Route                   │
│                                                          │
│  1. SELECT * FROM users WHERE username = 'john'         │
│  2. IF no user → return 401 Unauthorized                │
│  3. bcrypt.compare(password, user.password_hash)        │
│  4. IF no match → return 401 Unauthorized               │
│  5. IF match → generate JWT token                       │
│                                                          │
│     jwt.sign({                                          │
│       id: user.id,                                      │
│       role: user.role,                                  │
│       username: user.username                           │
│     }, JWT_SECRET, { expiresIn: '24h' })               │
│                                                          │
│  6. UPDATE users SET last_login = NOW()                 │
│  7. Return: { token, user: { id, username, role } }    │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
         TOKEN STORED IN FRONTEND
         sessionStorage.setItem('fence_token', token)
                    │
                    ▼
     ALL FUTURE API CALLS INCLUDE HEADER:
     Authorization: ******
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Protected Route Middleware                  │
│                                                          │
│  function authMiddleware(req, res, next) {              │
│    const token = req.headers.authorization?.split(' ')[1]│
│    IF !token → return 401                               │
│    jwt.verify(token, JWT_SECRET, (err, decoded) => {    │
│      IF err → return 401 (expired or invalid)           │
│      req.user = decoded                                  │
│      next()                                              │
│    })                                                    │
│  }                                                       │
└───────────────────┬─────────────────────────────────────┘
                    │
          ┌─────────┴──────────┐
          │                    │
          ▼                    ▼
   ┌──────────────┐    ┌──────────────────┐
   │   ALLOWED    │    │    FORBIDDEN     │
   │  role:admin  │    │  role:viewer     │
   │  role:estimat│    │  trying to       │
   │              │    │  DELETE/UPDATE   │
   │  Full CRUD   │    │                 │
   └──────────────┘    └──────────────────┘

ROLE PERMISSIONS TABLE:
═══════════════════════════════════════════════
Action              admin   estimator   viewer
───────────────────────────────────────────────
View estimates       ✓         ✓          ✓
Create estimates     ✓         ✓          ✗
Edit estimates       ✓         ✓          ✗
Delete estimates     ✓         ✗          ✗
View materials       ✓         ✓          ✓
Edit materials       ✓         ✓          ✗
Manage users         ✓         ✗          ✗
View settings        ✓         ✓          ✓
Edit settings        ✓         ✗          ✗
Lock prices          ✓         ✓          ✗
═══════════════════════════════════════════════
```
