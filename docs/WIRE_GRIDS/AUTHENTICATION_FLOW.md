# AUTHENTICATION FLOW
## Fence Depot Estimator — Login & Security

```
═══════════════════════════════════════════════════════════════
                    JWT AUTHENTICATION FLOW
═══════════════════════════════════════════════════════════════

  BROWSER                   SERVER                  DATABASE
  ───────                   ──────                  ────────

  ┌─────────────────────┐
  │  Login Form         │
  │  email: john@...    │─── POST /api/auth/login ──────────────►
  │  password: ****     │    { email, password }
  └─────────────────────┘
                                                      SELECT * FROM users
                                                      WHERE email = $1
                                                           ↓
                                                      bcrypt.compare(
                                                        password,
                                                        user.password_hash
                                                      )
                                                           ↓
                                              ┌────────────────────────┐
                                              │  VALID?                │
                                              │  YES → create JWT      │
                                              │  NO  → 401 Unauthorized│
                                              └────────────────────────┘
                                                           ↓ JWT created:
                                                    {
                                                      sub: user.id,
                                                      email: user.email,
                                                      role: user.role,
                                                      exp: now + 1hr
                                                    }
                                                    signed with JWT_SECRET

  ◄── 200 OK ─────────────── JWT token in httpOnly cookie ────────────┘
  Cookie set:
  • httpOnly=true (JS cannot read it)
  • Secure=true (HTTPS only)
  • SameSite=Strict (CSRF protection)
  • Max-Age=3600 (1 hour)

  ┌─────────────────────────────────────────────────────────────────┐
  │  SUBSEQUENT REQUESTS (after login)                              │
  ├─────────────────────────────────────────────────────────────────┤
  │                                                                 │
  │  Browser auto-sends cookie with every request                  │
  │                                                                 │
  │  GET /api/estimates ──────────────────────────────────────────► │
  │    Cookie: token=eyJ...                                        │
  │                                                                 │
  │                              authMiddleware():                  │
  │                              jwt.verify(token, JWT_SECRET)     │
  │                                   ↓                            │
  │                              ┌────────────────────┐            │
  │                              │ VALID?             │            │
  │                              │ YES → req.user set │            │
  │                              │       next()       │            │
  │                              │ NO  → 401          │            │
  │                              │ EXP → 401 (re-login│            │
  │                              └────────────────────┘            │
  └─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════
                    ROLE-BASED ACCESS CONTROL (RBAC)
═══════════════════════════════════════════════════════════════

  ROLE: admin
  ──────────────────────────────────────────────────
  ✅ Create/edit/delete users
  ✅ View all projects (any user)
  ✅ Edit any estimate
  ✅ View analytics / reports
  ✅ Manage inventory
  ✅ Access admin dashboard
  ✅ Run database procedures

  ROLE: estimator
  ──────────────────────────────────────────────────
  ✅ Create customers
  ✅ Create/edit their own projects
  ✅ Create/edit estimates (their projects)
  ✅ Lock estimate prices
  ✅ Generate PDFs
  ✅ Send emails to customers
  ✅ View inventory (read-only)
  ❌ Cannot edit other estimators' projects
  ❌ Cannot manage users
  ❌ Cannot access admin dashboard

  ROLE: viewer
  ──────────────────────────────────────────────────
  ✅ View projects (read-only)
  ✅ View estimates (read-only)
  ✅ Print/view PDFs
  ❌ Cannot create or edit anything
  ❌ Cannot send emails


═══════════════════════════════════════════════════════════════
                    ACCOUNT LOCKOUT POLICY
═══════════════════════════════════════════════════════════════

  Failed Login Attempts  Action
  ─────────────────────  ──────
  1-4 failures           Warn user, count tracked
  5 failures             Account locked for 15 minutes
  10 failures            Account locked until admin unlocks
  Suspicious pattern     Alert admin via email

  Implementation: Track failed attempts in Redis or in users table
    users.failed_login_count  INTEGER DEFAULT 0
    users.locked_until        TIMESTAMP
```
