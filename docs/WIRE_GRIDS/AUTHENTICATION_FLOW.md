# AUTHENTICATION FLOW DIAGRAM
**Fence Estimator Pro** – Login and Session Management

```
                    ┌─────────────┐
                    │    USER     │
                    └──────┬──────┘
                           │ Enters username + password
                           ▼
                    ┌─────────────┐
                    │  FRONTEND   │
                    │  api.js     │
                    └──────┬──────┘
                           │ POST /api/auth/login
                           │ {username, password}
                           ▼
                    ┌─────────────────────┐
                    │  BACKEND            │
                    │  /api/auth/login    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  DATABASE           │
                    │  SELECT user WHERE  │
                    │  username = ?       │
                    └──────────┬──────────┘
                               │ User found?
                  ┌────────────┴────────────┐
                  │ YES                     │ NO
                  ▼                         ▼
        ┌──────────────────┐      ┌─────────────────┐
        │ bcrypt.compare() │      │ Return 401      │
        │ (password check) │      │ "Invalid creds" │
        └─────────┬────────┘      └─────────────────┘
                  │ Match?
        ┌─────────┴─────────┐
        │ YES               │ NO
        ▼                   ▼
┌───────────────┐  ┌─────────────────┐
│ Sign JWT      │  │ Return 401      │
│ {userId,role} │  │ "Invalid creds" │
│ expires: 7d   │  └─────────────────┘
└───────┬───────┘
        │ Return {token, user}
        ▼
┌───────────────────────────┐
│  FRONTEND                 │
│  Storage.saveToken(token) │
│  Storage.saveUser(user)   │
└──────────────┬────────────┘
               │
               ▼
┌───────────────────────────┐
│  ALL SUBSEQUENT REQUESTS  │
│  Add header:              │
│  Authorization: ******
│  <token>                  │
└──────────────┬────────────┘
               │
               ▼
┌───────────────────────────┐
│  BACKEND MIDDLEWARE       │
│  verifyToken()            │
│  - Decode JWT             │
│  - Check expiry           │
│  - Attach req.user        │
└──────────────┬────────────┘
               │ Valid?
    ┌──────────┴──────────┐
    │ YES                 │ NO
    ▼                     ▼
┌─────────┐         ┌──────────┐
│ Proceed │         │ 401      │
│ Request │         │ Redirect │
└─────────┘         │ to Login │
                    └──────────┘

LOGOUT FLOW:
User clicks Logout
→ POST /api/auth/logout (invalidates on server if tracked)
→ Storage.clearUser() (removes token from localStorage)
→ UI resets to "Not Logged In"
```
