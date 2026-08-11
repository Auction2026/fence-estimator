# AUTHENTICATION FLOW
## Fence Depot Fence Estimator - Login and Security System

```
═══════════════════════════════════════════════════════════════════════════
                    AUTHENTICATION FLOW DIAGRAM v1.0
═══════════════════════════════════════════════════════════════════════════

FIRST TIME: USER REGISTRATION
──────────────────────────────

  USER FILLS FORM              SERVER                    DATABASE
  ┌────────────────┐                                   
  │ Username:_____ │                                   
  │ Email: _______ │──── POST /api/auth/register ────►
  │ Password:_____ │                                    Check email
  │ Company:______ │                                    not already used
  └────────────────┘                                         │
                                                        Hash password:
                                                        bcrypt.hash(password, 10)
                                                        (makes it unreadable)
                                                             │
                                                        Save new user
                                                        to users collection
                                                             │
                          ◄──── Response: 201 Created ───────┘
                          { message: "Account created", userId: "..." }
                               │
                          Show success
                          Redirect to login


RETURNING USER: LOGIN
─────────────────────

  USER FILLS FORM              SERVER                    DATABASE
  ┌────────────────┐
  │ Email: _______ │──── POST /api/auth/login ─────────►
  │ Password:_____ │                                    Find user
  └────────────────┘                                    by email
                                                             │
                                                        bcrypt.compare(
                                                          enteredPassword,
                                                          storedHash
                                                        )
                                                             │
                                                    ┌────────┴────────┐
                                                  MATCH           NO MATCH
                                                    │                 │
                                             Generate JWT        Return 401
                                             token:              "Invalid
                                             jwt.sign({          credentials"
                                               userId,
                                               role
                                             }, SECRET,
                                             {expiresIn: '7d'})
                                                    │
                          ◄──── Response: 200 OK ───┘
                          { token: "******",
                            user: { name, email, role } }
                               │
                          Store in localStorage:
                          localStorage.setItem('token', token)
                          localStorage.setItem('user', JSON.stringify(user))
                               │
                          Show main application (all 17 tabs)


AUTHENTICATED API REQUEST
─────────────────────────

  EVERY API CALL includes the token:

  fetch('/api/projects', {
    headers: {
      'Authorization': `******${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  })
       │
       ▼
  SERVER MIDDLEWARE (runs before every protected route):
  ┌─────────────────────────────────────────────────────────────────────┐
  │  1. Extract token from Authorization header                         │
  │  2. jwt.verify(token, JWT_SECRET)                                   │
  │     ├── Token valid: extract userId, continue to route handler      │
  │     └── Token invalid/expired: return 401 Unauthorized              │
  └─────────────────────────────────────────────────────────────────────┘

LOGOUT
──────

  User clicks "Logout":
  ┌──────────────────────────────────────────────────┐
  │  localStorage.removeItem('token')                │
  │  localStorage.removeItem('user')                 │
  │  Redirect to login page                          │
  └──────────────────────────────────────────────────┘
  
  Note: Token remains valid until it expires (7 days)
  but since it's removed from storage, user must login again

USER ROLES AND PERMISSIONS
──────────────────────────

  ROLE: admin
  ┌──────────────────────────────────────────────────────────────────┐
  │  ✅ Create/view/edit/delete ALL projects (any user)              │
  │  ✅ Manage users (add/remove/change roles)                       │
  │  ✅ View all estimates and reports                               │
  │  ✅ Manage inventory/products                                    │
  │  ✅ Access all 17 tabs                                           │
  └──────────────────────────────────────────────────────────────────┘

  ROLE: estimator (default for new users)
  ┌──────────────────────────────────────────────────────────────────┐
  │  ✅ Create/view/edit OWN projects                                │
  │  ✅ Create estimates and contracts                               │
  │  ✅ View inventory (read-only)                                   │
  │  ✅ Access all 17 tabs                                           │
  │  ❌ Cannot delete projects                                       │
  │  ❌ Cannot manage users                                          │
  │  ❌ Cannot edit other users' projects                            │
  └──────────────────────────────────────────────────────────────────┘

  ROLE: crew
  ┌──────────────────────────────────────────────────────────────────┐
  │  ✅ View assigned projects                                       │
  │  ✅ Add notes and photos                                         │
  │  ✅ Update schedule/progress                                     │
  │  ❌ Cannot create estimates                                      │
  │  ❌ Cannot create contracts                                      │
  │  ❌ Cannot access financial data                                 │
  └──────────────────────────────────────────────────────────────────┘

TOKEN LIFECYCLE
───────────────

  Login ──► Token Created ──► Used for 7 days ──► Expires ──► Login Again
     │
     └── Token stored in browser localStorage
         (NOT in cookies - no server sessions needed)
         (Cleared on logout or after 7 days)

SECURITY NOTES
──────────────
  • Passwords are NEVER stored in plain text (bcrypt hashed)
  • Tokens are signed with a SECRET key (change JWT_SECRET in .env!)
  • HTTPS should be used in production (prevents token interception)
  • Each token expires after 7 days (reduces risk if stolen)

═══════════════════════════════════════════════════════════════════════════
```
