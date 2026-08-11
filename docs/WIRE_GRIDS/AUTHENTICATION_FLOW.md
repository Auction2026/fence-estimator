
# Authentication Flow

```text
Login Form
   |
   v
POST /api/auth/login
   |
   v
Validate credentials
(email exists? password matches? user active?)
   |
   +--> invalid -> 401 response -> show login error
   |
   v
Generate JWT
   |
   v
Return token + user profile
   |
   v
Store token in localStorage
   |
   v
Include Authorization: ******
in future API headers
   |
   v
Express verify-JWT middleware
   |
   +--> invalid / expired -> 401 deny access
   |
   v
Role / permission checks
   |
   +--> insufficient role -> 403 deny access
   |
   v
Allow access to protected route
```
