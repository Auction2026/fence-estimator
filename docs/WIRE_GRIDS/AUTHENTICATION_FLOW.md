# DIAGRAM 7: AUTHENTICATION FLOW
## Fence Depot Fence Estimator — Login & Security System

```
═══════════════════════════════════════════════════════════════════════
                   AUTHENTICATION FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════════

USER OPENS APP
──────────────
  Browser loads index.html
       │
       ▼
  Check localStorage:
  token = localStorage.getItem('authToken')
       │
       ├──── token exists AND not expired ──────► Go to Dashboard
       │
       └──── no token / expired ─────────────────► Show Landing Page


REGISTRATION FLOW (New User)
─────────────────────────────
  Admin clicks "Add User" in Settings tab
       │
       ▼
  Fill in form:
  • Username (3+ chars, unique)
  • Email (valid format)
  • Password (6+ chars)
  • Role: admin / estimator / crew
  • Company name
       │
       ▼
  POST /api/auth/register
       │
       ▼
  ┌────────────────────────────────────┐
  │  Backend Validation:               │
  │  1. Check username not taken        │
  │  2. Check email not taken           │
  │  3. Validate email format           │
  │  4. Check password length           │
  └────────────────┬───────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
  Validation fails        Validation passes
  Return 400 error        Proceed
  Show error message           │
                               ▼
                     bcrypt.hash(password, 10)
                          └──► stored as hash
                               │
                               ▼
                     User saved to database
                               │
                               ▼
                     Return 201 Created


LOGIN FLOW
──────────────
  User on Login Screen
       │
       ▼
  Enter: Username/Email + Password
  Click [Login]
       │
       ▼
  POST /api/auth/login
  { username: "john", password: "abc123" }
       │
       ▼
  ┌────────────────────────────────────┐
  │  Backend Process:                   │
  │  1. Find user by username OR email  │
  │  2. If not found → return 401       │
  │  3. bcrypt.compare(password, hash) │
  │  4. If no match → return 401        │
  │  5. Generate JWT token              │
  └────────────────┬───────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
  Auth Failed               Auth Success
  Show error message              │
  "Invalid credentials"           ▼
                        jwt.sign({
                          userId: user._id,
                          role: user.role
                        },
                        JWT_SECRET,
                        { expiresIn: '7d' })
                                  │
                                  ▼
                        Return 200 + token
                        {
                          token: "eyJhb...",
                          user: { id, username, role }
                        }
                                  │
                                  ▼
                        Frontend stores:
                        localStorage.setItem('authToken', token)
                        localStorage.setItem('userRole', role)
                                  │
                                  ▼
                        Navigate to Dashboard ✅


AUTHENTICATED API REQUEST FLOW
────────────────────────────────────────
  User action triggers API call
       │
       ▼
  Frontend reads token from localStorage
       │
       ▼
  HTTP Request with header:
  Authorization: ******
       │
       ▼
  ┌────────────────────────────────────┐
  │  Auth Middleware (server.js)        │
  │  1. Extract token from header       │
  │  2. jwt.verify(token, JWT_SECRET)  │
  │  3. Attach user to req.user         │
  └────────────────┬───────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
  Token invalid           Token valid
  Return 401              Proceed to route handler
  Unauthorized            req.user = { userId, role }
  Frontend redirects            │
  to login screen               ▼
                        Role check (if needed):
                        if (req.user.role !== 'admin')
                          return 403 Forbidden
                                  │
                                  ▼
                        Execute route logic
                        Return response


LOGOUT FLOW
───────────
  User clicks [Logout]
       │
       ▼
  confirm("Are you sure?")
       │
       ▼
  localStorage.removeItem('authToken')
  localStorage.removeItem('userRole')
       │
       ▼
  Navigate to Landing Page ✅
  (No server call needed — JWT is stateless)


ROLE PERMISSIONS TABLE
───────────────────────────────────────────────────────────────
  Feature                  │ Admin │ Estimator │ Crew
  ─────────────────────────┼───────┼───────────┼──────────
  View Dashboard           │  ✅   │    ✅     │   ✅
  Create Estimates         │  ✅   │    ✅     │   ❌
  Edit Estimates           │  ✅   │    ✅     │   ❌
  Delete Estimates         │  ✅   │    ❌     │   ❌
  View Projects            │  ✅   │    ✅     │   ✅
  Edit Projects            │  ✅   │    ✅     │   ❌
  Change Order Approval    │  ✅   │    ❌     │   ❌
  Unlock Pricing           │  ✅   │    ❌     │   ❌
  Manage Inventory         │  ✅   │    ✅     │   ❌
  Manage Users             │  ✅   │    ❌     │   ❌
  View Analytics           │  ✅   │    ✅     │   ❌
  Change Settings          │  ✅   │    ❌     │   ❌

═══════════════════════════════════════════════════════════════════════
SECURITY NOTES:
  • Passwords stored as bcrypt hashes (cost factor 10) — never plain text
  • JWT tokens expire after 7 days (configurable via JWT_EXPIRY in .env)
  • All API routes require valid JWT token
  • Role checked server-side (not just frontend)
  • HTTPS required in production to protect tokens in transit
═══════════════════════════════════════════════════════════════════════
```
